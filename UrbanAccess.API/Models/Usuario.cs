using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrbanAccess.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string? Nome { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }
        
        [Required]
        [StringLength(14)]
        public string? CPF { get; set; }
        
        [Required]
        [StringLength(20)]
        public string? Telefone { get; set; }
        
        [Required]
        [StringLength(100)]
        public string? Senha { get; set; }
        
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        public virtual ICollection<Ocorrencia> Ocorrencias { get; set; }
        public virtual ICollection<Validacao> Validacoes { get; set; }
    }
}
