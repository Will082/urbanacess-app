using System;
using System.ComponentModel.DataAnnotations;

namespace UrbanAccess.API.Models
{
    public class Validacao
    {
        public int Id { get; set; }
        
        [Required]
        public int OcorrenciaId { get; set; }
        
        [Required]
        public int UsuarioId { get; set; }
        
        [StringLength(500)]
        public string? Comentario { get; set; }
        
        public DateTime DataValidacao { get; set; } = DateTime.Now;
        
        public virtual Ocorrencia Ocorrencia { get; set; }
        public virtual Usuario Usuario { get; set; }
    }
}
