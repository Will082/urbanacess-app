using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UrbanAccess.API.Data;
using UrbanAccess.API.Models;

namespace UrbanAccess.API.Services
{
    public class UsuarioService
    {
        private readonly ApplicationDbContext _context;

        public UsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario> GetUsuarioByIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task<Usuario> GetUsuarioByEmailAsync(string email)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<Usuario> CreateUsuarioAsync(Usuario usuario)
        {
            // Verificar se já existe usuário com o mesmo email ou CPF
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
                throw new Exception("Email já cadastrado");
                
            if (await _context.Usuarios.AnyAsync(u => u.CPF == usuario.CPF))
                throw new Exception("CPF já cadastrado");
                
            // Hash da senha
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
            
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> UpdateUsuarioAsync(Usuario usuario)
        {
            // Verificar se o email já está em uso por outro usuário
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email && u.Id != usuario.Id))
                throw new Exception("Email já cadastrado por outro usuário");
                
            // Verificar se o CPF já está em uso por outro usuário
            if (await _context.Usuarios.AnyAsync(u => u.CPF == usuario.CPF && u.Id != usuario.Id))
                throw new Exception("CPF já cadastrado por outro usuário");
                
            _context.Entry(usuario).State = EntityState.Modified;
            
            // Não atualizar a senha se ela não foi alterada
            _context.Entry(usuario).Property(u => u.Senha).IsModified = false;
            
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> UpdateSenhaAsync(int usuarioId, string senhaAtual, string novaSenha)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
                return false;
                
            // Verificar se a senha atual está correta
            if (!BCrypt.Net.BCrypt.Verify(senhaAtual, usuario.Senha))
                return false;
                
            // Atualizar para a nova senha
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(novaSenha);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> ValidateCredentialsAsync(string email, string senha)
        {
            var usuario = await GetUsuarioByEmailAsync(email);
            if (usuario == null)
                return false;
                
            return BCrypt.Net.BCrypt.Verify(senha, usuario.Senha);
        }
    }
}
