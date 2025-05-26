using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using UrbanAccess.API.Models;

namespace UrbanAccess.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Garantir que o banco de dados foi criado
            context.Database.EnsureCreated();

            // Verificar se já existem categorias (indicador de inicialização)
            if (context.Categorias.Any() && context.Usuarios.Any(u => u.Email == "teste@urbanaccess.com"))
            {
                // Se o usuário de teste já existe, verificar e atualizar a senha se necessário
                var testUser = context.Usuarios.FirstOrDefault(u => u.Email == "teste@urbanaccess.com");
                if (testUser != null && !BCrypt.Net.BCrypt.Verify("123456", testUser.Senha))
                {
                    Console.WriteLine("Atualizando hash da senha do usuário de teste...");
                    testUser.Senha = BCrypt.Net.BCrypt.HashPassword("123456");
                    context.SaveChanges();
                    Console.WriteLine("Hash da senha do usuário de teste atualizado.");
                }
                // return; // Não retornar aqui para garantir que o restante seja verificado/adicionado se necessário
            }

            // Adicionar categorias se não existirem
            if (!context.Categorias.Any())
            {
                var categorias = new List<Categoria>
                {
                    new Categoria { Nome = "Calçada Danificada", Descricao = "Problemas em calçadas como buracos, desníveis ou obstáculos", Icone = "sidewalk" },
                    new Categoria { Nome = "Falta de Rampa", Descricao = "Ausência de rampas de acesso em locais necessários", Icone = "ramp" },
                    new Categoria { Nome = "Obstáculo na Via", Descricao = "Objetos ou estruturas que impedem a passagem", Icone = "block" },
                    new Categoria { Nome = "Semáforo sem Sinal Sonoro", Descricao = "Semáforos sem acessibilidade para deficientes visuais", Icone = "traffic_light" },
                    new Categoria { Nome = "Falta de Piso Tátil", Descricao = "Ausência de piso tátil para orientação de deficientes visuais", Icone = "texture" },
                    new Categoria { Nome = "Vaga Inacessível", Descricao = "Vagas para PCD mal projetadas ou obstruídas", Icone = "local_parking" },
                    new Categoria { Nome = "Transporte Público sem Acessibilidade", Descricao = "Veículos ou estações sem adaptações necessárias", Icone = "directions_bus" }
                };
                context.Categorias.AddRange(categorias);
                context.SaveChanges();
            }

            // Adicionar usuário de teste se não existir
            if (!context.Usuarios.Any(u => u.Email == "teste@urbanaccess.com"))
            {
                Console.WriteLine("Criando usuário de teste...");
                var usuario = new Usuario
                {
                    Nome = "Usuário Teste",
                    Email = "teste@urbanaccess.com",
                    CPF = "123.456.789-00", // Garantir que este CPF não cause conflito
                    Telefone = "(11) 98765-4321",
                    Senha = BCrypt.Net.BCrypt.HashPassword("123456"), // Hash da senha
                    DataCadastro = DateTime.Now.AddDays(-30)
                };
                context.Usuarios.Add(usuario);
                context.SaveChanges();
                Console.WriteLine("Usuário de teste criado.");

                // Adicionar ocorrências de teste apenas se o usuário foi recém-criado
                var categoriasDb = context.Categorias.ToList(); // Obter categorias do DB
                var ocorrencias = new List<Ocorrencia>
                {
                    new Ocorrencia
                    {
                        UsuarioId = usuario.Id,
                        CategoriaId = categoriasDb.FirstOrDefault(c => c.Nome == "Calçada Danificada")?.Id ?? categoriasDb.First().Id,
                        Descricao = "Calçada com buracos e sem acessibilidade",
                        Endereco = "Av. Paulista, 1000, São Paulo - SP",
                        Latitude = -23.5505,
                        Longitude = -46.6333,
                        ImagemUrl = "https://picsum.photos/id/1/200/300",
                        DataCriacao = DateTime.Now.AddDays(-15),
                        Status = "validada",
                        Urgente = true,
                        PontoPublico = true
                    },
                     new Ocorrencia
                    {
                        UsuarioId = usuario.Id,
                        CategoriaId = categoriasDb.FirstOrDefault(c => c.Nome == "Falta de Rampa")?.Id ?? categoriasDb.First().Id,
                        Descricao = "Não há rampa de acesso na esquina",
                        Endereco = "Rua Augusta, 500, São Paulo - SP",
                        Latitude = -23.5505,
                        Longitude = -46.6333,
                        ImagemUrl = "https://picsum.photos/id/2/200/300",
                        DataCriacao = DateTime.Now.AddDays(-10),
                        Status = "aguardando_validacao",
                        Urgente = false,
                        PontoPublico = true
                    },
                    // ... (outras ocorrências omitidas para brevidade)
                };
                context.Ocorrencias.AddRange(ocorrencias);
                context.SaveChanges();

                // Adicionar validações de teste
                 if (ocorrencias.Any())
                 {
                    var validacoes = new List<Validacao>
                    {
                        new Validacao
                        {
                            OcorrenciaId = ocorrencias[0].Id,
                            UsuarioId = usuario.Id,
                            Comentario = "Confirmei pessoalmente este problema",
                            DataValidacao = DateTime.Now.AddDays(-12)
                        }
                    };
                    context.Validacoes.AddRange(validacoes);
                    context.SaveChanges();
                 }
            }
        }
    }
}

