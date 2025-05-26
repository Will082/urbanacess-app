using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UrbanAccess.API.Data;
using UrbanAccess.API.Models;

namespace UrbanAccess.API.Services
{
    public class OcorrenciaService
    {
        private readonly ApplicationDbContext _context;

        public OcorrenciaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ocorrencia>> GetAllOcorrenciasAsync()
        {
            return await _context.Ocorrencias
                .Include(o => o.Categoria)
                .Include(o => o.Usuario)
                .OrderByDescending(o => o.DataCriacao)
                .ToListAsync();
        }

        public async Task<Ocorrencia> GetOcorrenciaByIdAsync(int id)
        {
            return await _context.Ocorrencias
                .Include(o => o.Categoria)
                .Include(o => o.Usuario)
                .Include(o => o.Validacoes)
                .ThenInclude(v => v.Usuario)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<List<Ocorrencia>> GetOcorrenciasByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Ocorrencias
                .Include(o => o.Categoria)
                .Where(o => o.UsuarioId == usuarioId)
                .OrderByDescending(o => o.DataCriacao)
                .ToListAsync();
        }

        public async Task<List<Ocorrencia>> GetOcorrenciasProximasAsync(double latitude, double longitude, double raioKm = 5)
        {
            // Cálculo simplificado para encontrar ocorrências próximas
            // Em uma implementação real, usaríamos cálculos geoespaciais mais precisos
            const double grausPorKm = 0.01; // Aproximação simples: 0.01 graus ≈ 1 km
            double raioGraus = raioKm * grausPorKm;
            
            return await _context.Ocorrencias
                .Include(o => o.Categoria)
                .Where(o => 
                    o.Latitude >= latitude - raioGraus && 
                    o.Latitude <= latitude + raioGraus &&
                    o.Longitude >= longitude - raioGraus && 
                    o.Longitude <= longitude + raioGraus)
                .OrderByDescending(o => o.DataCriacao)
                .ToListAsync();
        }

        public async Task<Ocorrencia> CreateOcorrenciaAsync(Ocorrencia ocorrencia)
        {
            _context.Ocorrencias.Add(ocorrencia);
            await _context.SaveChangesAsync();
            return ocorrencia;
        }

        public async Task<Ocorrencia> UpdateOcorrenciaAsync(Ocorrencia ocorrencia)
        {
            _context.Entry(ocorrencia).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return ocorrencia;
        }

        public async Task<bool> ValidarOcorrenciaAsync(int ocorrenciaId, int usuarioId, string comentario)
        {
            var ocorrencia = await _context.Ocorrencias.FindAsync(ocorrenciaId);
            if (ocorrencia == null)
                return false;
                
            // Adicionar validação
            var validacao = new Validacao
            {
                OcorrenciaId = ocorrenciaId,
                UsuarioId = usuarioId,
                Comentario = comentario,
                DataValidacao = DateTime.Now
            };
            
            _context.Validacoes.Add(validacao);
            
            // Atualizar status da ocorrência
            ocorrencia.Status = "validada";
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UpdateImagemOcorrenciaAsync(int ocorrenciaId, string imagemUrl)
        {
            var ocorrencia = await _context.Ocorrencias.FindAsync(ocorrenciaId);
            if (ocorrencia == null)
                return null;
                
            ocorrencia.ImagemUrl = imagemUrl;
            await _context.SaveChangesAsync();
            
            return imagemUrl;
        }
    }
}
