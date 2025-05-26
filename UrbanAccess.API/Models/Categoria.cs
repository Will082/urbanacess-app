using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrbanAccess.API.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string? Nome { get; set; }
        
        [StringLength(500)]
        public string? Descricao { get; set; }
        
        [StringLength(100)]
        public string? Icone { get; set; }

        public virtual ICollection<Ocorrencia> Ocorrencias { get; set; } = new List<Ocorrencia>();
    }
}
