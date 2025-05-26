using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrbanAccess.API.Models;
using UrbanAccess.API.Services;

namespace UrbanAccess.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OcorrenciasController : ControllerBase
    {
        private readonly OcorrenciaService _ocorrenciaService;

        public OcorrenciasController(OcorrenciaService ocorrenciaService)
        {
            _ocorrenciaService = ocorrenciaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ocorrencias = await _ocorrenciaService.GetAllOcorrenciasAsync();
            return Ok(ocorrencias);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ocorrencia = await _ocorrenciaService.GetOcorrenciaByIdAsync(id);
            if (ocorrencia == null)
                return NotFound(new { error = "Ocorrência não encontrada" });

            return Ok(ocorrencia);
        }

        [HttpGet("minhas")]
        public async Task<IActionResult> GetMinhas()
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var ocorrencias = await _ocorrenciaService.GetOcorrenciasByUsuarioIdAsync(usuarioId);
            return Ok(ocorrencias);
        }

        [HttpGet("proximas")]
        public async Task<IActionResult> GetProximas([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] double raioKm = 5)
        {
            var ocorrencias = await _ocorrenciaService.GetOcorrenciasProximasAsync(latitude, longitude, raioKm);
            return Ok(ocorrencias);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OcorrenciaRequest request)
        {
            if (string.IsNullOrEmpty(request.Descricao) || string.IsNullOrEmpty(request.Endereco))
                return BadRequest(new { error = "Descrição e endereço são obrigatórios" });

            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var ocorrencia = new Ocorrencia
            {
                UsuarioId = usuarioId,
                CategoriaId = request.CategoriaId,
                Descricao = request.Descricao,
                Endereco = request.Endereco,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                ImagemUrl = request.ImagemUrl,
                DataCriacao = DateTime.Now,
                Status = "aguardando_validacao",
                Urgente = request.Urgente,
                PontoPublico = request.PontoPublico
            };

            var novaOcorrencia = await _ocorrenciaService.CreateOcorrenciaAsync(ocorrencia);
            return CreatedAtAction(nameof(GetById), new { id = novaOcorrencia.Id }, novaOcorrencia);
        }

        [HttpPost("{id}/validar")]
        public async Task<IActionResult> Validar(int id, [FromBody] ValidacaoRequest request)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var resultado = await _ocorrenciaService.ValidarOcorrenciaAsync(id, usuarioId, request.Comentario);

            if (!resultado)
                return NotFound(new { error = "Ocorrência não encontrada" });

            return Ok(new { message = "Ocorrência validada com sucesso" });
        }

        [HttpPost("{id}/upload-imagem")]
        public async Task<IActionResult> UploadImagem(int id, [FromBody] UploadImagemRequest request)
        {
            if (string.IsNullOrEmpty(request.ImagemUrl))
                return BadRequest(new { error = "URL da imagem é obrigatória" });

            var imagemUrl = await _ocorrenciaService.UpdateImagemOcorrenciaAsync(id, request.ImagemUrl);

            if (imagemUrl == null)
                return NotFound(new { error = "Ocorrência não encontrada" });

            return Ok(new { imagemUrl });
        }
    }

    public class OcorrenciaRequest
    {
        public int CategoriaId { get; set; }
        public string? Descricao { get; set; }
        public string? Endereco { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? ImagemUrl { get; set; }
        public bool Urgente { get; set; }
        public bool PontoPublico { get; set; }
    }

    public class ValidacaoRequest
    {
        public string? Comentario { get; set; }
    }

    public class UploadImagemRequest
    {
        public string? ImagemUrl { get; set; }
    }
}
