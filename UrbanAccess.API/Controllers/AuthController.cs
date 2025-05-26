using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrbanAccess.API.Models;
using UrbanAccess.API.Services;

namespace UrbanAccess.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;
        private readonly TokenService _tokenService;

        public AuthController(UsuarioService usuarioService, TokenService tokenService)
        {
            _usuarioService = usuarioService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Senha))
                return BadRequest(new { error = "Email e senha são obrigatórios" });

            var usuario = await _usuarioService.GetUsuarioByEmailAsync(request.Email);
            if (usuario == null || !await _usuarioService.ValidateCredentialsAsync(request.Email, request.Senha))
                return Unauthorized(new { error = "Email ou senha incorretos" });

            var token = _tokenService.GenerateToken(usuario);

            return Ok(new
            {
                id = usuario.Id,
                nome = usuario.Nome,
                email = usuario.Email,
                cpf = usuario.CPF,
                telefone = usuario.Telefone,
                token
            });
        }

        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastro([FromBody] CadastroRequest request)
        {
            if (string.IsNullOrEmpty(request.Nome) || string.IsNullOrEmpty(request.Email) || 
                string.IsNullOrEmpty(request.CPF) || string.IsNullOrEmpty(request.Telefone) || 
                string.IsNullOrEmpty(request.Senha))
                return BadRequest(new { error = "Todos os campos são obrigatórios" });

            try
            {
                var novoUsuario = new Usuario
                {
                    Nome = request.Nome,
                    Email = request.Email,
                    CPF = request.CPF,
                    Telefone = request.Telefone,
                    Senha = request.Senha,
                    DataCadastro = DateTime.Now
                };

                var usuario = await _usuarioService.CreateUsuarioAsync(novoUsuario);
                var token = _tokenService.GenerateToken(usuario);

                return Ok(new
                {
                    id = usuario.Id,
                    nome = usuario.Nome,
                    email = usuario.Email,
                    cpf = usuario.CPF,
                    telefone = usuario.Telefone,
                    token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Senha { get; set; }
    }

    public class CadastroRequest
    {
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? CPF { get; set; }
        public string? Telefone { get; set; }
        public string? Senha { get; set; }
    }
}
