using System;
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
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuariosController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet("perfil")]
        public async Task<IActionResult> GetPerfil()
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var usuario = await _usuarioService.GetUsuarioByIdAsync(usuarioId);

            if (usuario == null)
                return NotFound(new { error = "Usuário não encontrado" });

            return Ok(new
            {
                id = usuario.Id,
                nome = usuario.Nome,
                email = usuario.Email,
                cpf = usuario.CPF,
                telefone = usuario.Telefone,
                dataCadastro = usuario.DataCadastro
            });
        }

        [HttpPut("perfil")]
        public async Task<IActionResult> UpdatePerfil([FromBody] AtualizarPerfilRequest request)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var usuario = await _usuarioService.GetUsuarioByIdAsync(usuarioId);

            if (usuario == null)
                return NotFound(new { error = "Usuário não encontrado" });

            try
            {
                usuario.Nome = request.Nome ?? usuario.Nome;
                usuario.Telefone = request.Telefone ?? usuario.Telefone;

                var usuarioAtualizado = await _usuarioService.UpdateUsuarioAsync(usuario);

                return Ok(new
                {
                    id = usuarioAtualizado.Id,
                    nome = usuarioAtualizado.Nome,
                    email = usuarioAtualizado.Email,
                    cpf = usuarioAtualizado.CPF,
                    telefone = usuarioAtualizado.Telefone,
                    dataCadastro = usuarioAtualizado.DataCadastro
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("senha")]
        public async Task<IActionResult> UpdateSenha([FromBody] AtualizarSenhaRequest request)
        {
            if (string.IsNullOrEmpty(request.SenhaAtual) || string.IsNullOrEmpty(request.NovaSenha))
                return BadRequest(new { error = "Senha atual e nova senha são obrigatórias" });

            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var resultado = await _usuarioService.UpdateSenhaAsync(usuarioId, request.SenhaAtual, request.NovaSenha);

            if (!resultado)
                return BadRequest(new { error = "Senha atual incorreta" });

            return Ok(new { message = "Senha atualizada com sucesso" });
        }
    }

    public class AtualizarPerfilRequest
    {
        public string? Nome { get; set; }
        public string? Telefone { get; set; }
    }

    public class AtualizarSenhaRequest
    {
        public string? SenhaAtual { get; set; }
        public string? NovaSenha { get; set; }
    }
}
