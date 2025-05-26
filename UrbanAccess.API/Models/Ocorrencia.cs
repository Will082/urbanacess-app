using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrbanAccess.API.Models
{
    public class Ocorrencia
    {
        public int Id { get; set; }
        
        [Required]
        public int UsuarioId { get; set; }
        
        [Required]
        public int CategoriaId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string? Descricao { get; set; }
        
        [Required]
        [StringLength(200)]
        public string? Endereco { get; set; }
        
        [Required]
        public double Latitude { get; set; }
        
        [Required]
        public double Longitude { get; set; }
        
        [StringLength(500)]
        public string? ImagemUrl { get; set; }
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "aguardando_validacao";
        
        public bool Urgente { get; set; }
        
        public bool PontoPublico { get; set; }
        
        public virtual Usuario Usuario { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual ICollection<Validacao> Validacoes { get; set; }
    }
}
