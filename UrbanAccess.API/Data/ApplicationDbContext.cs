using Microsoft.EntityFrameworkCore;
using UrbanAccess.API.Models;

namespace UrbanAccess.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Ocorrencia> Ocorrencias { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Validacao> Validacoes { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações de relacionamentos e índices
            modelBuilder.Entity<Ocorrencia>()
                .HasOne(o => o.Usuario)
                .WithMany(u => u.Ocorrencias)
                .HasForeignKey(o => o.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Ocorrencia>()
                .HasOne(o => o.Categoria)
                .WithMany(c => c.Ocorrencias)
                .HasForeignKey(o => o.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Validacao>()
                .HasOne(v => v.Ocorrencia)
                .WithMany(o => o.Validacoes)
                .HasForeignKey(v => v.OcorrenciaId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Validacao>()
                .HasOne(v => v.Usuario)
                .WithMany(u => u.Validacoes)
                .HasForeignKey(v => v.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Índices para melhorar a performance
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();
                
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.CPF)
                .IsUnique();
                
            modelBuilder.Entity<Ocorrencia>()
                .HasIndex(o => new { o.Latitude, o.Longitude });
        }
    }
}
