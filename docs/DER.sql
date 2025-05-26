CREATE TABLE [Usuario] (
  [id_usuario] int PRIMARY KEY IDENTITY(1, 1),
  [nome] nvarchar(255),
  [email] nvarchar(255),
  [cpf] nvarchar(255),
  [telefone] nvarchar(255),
  [senha] nvarchar(255),
  [data_cadastro] datetime
)
GO

CREATE TABLE [Ocorrencia] (
  [id_ocorrencia] int PRIMARY KEY IDENTITY(1, 1),
  [id_usuario] int,
  [titulo] nvarchar(255),
  [descricao] text,
  [categoria] nvarchar(255),
  [latitude] float,
  [longitude] float,
  [foto_url] nvarchar(255),
  [data_criacao] datetime,
  [status] nvarchar(255)
)
GO

CREATE TABLE [Validacao] (
  [id_validacao] int PRIMARY KEY IDENTITY(1, 1),
  [id_ocorrencia] int,
  [id_usuario] int,
  [data_validacao] datetime
)
GO

CREATE TABLE [Etiqueta] (
  [id_etiqueta] int PRIMARY KEY IDENTITY(1, 1),
  [nome] nvarchar(255)
)
GO

CREATE TABLE [OcorrenciaEtiqueta] (
  [id_ocorrencia] int,
  [id_etiqueta] int,
  PRIMARY KEY ([id_ocorrencia], [id_etiqueta])
)
GO

ALTER TABLE [Ocorrencia] ADD FOREIGN KEY ([id_usuario]) REFERENCES [Usuario] ([id_usuario])
GO

ALTER TABLE [Validacao] ADD FOREIGN KEY ([id_ocorrencia]) REFERENCES [Ocorrencia] ([id_ocorrencia])
GO

ALTER TABLE [Validacao] ADD FOREIGN KEY ([id_usuario]) REFERENCES [Usuario] ([id_usuario])
GO

ALTER TABLE [OcorrenciaEtiqueta] ADD FOREIGN KEY ([id_ocorrencia]) REFERENCES [Ocorrencia] ([id_ocorrencia])
GO

ALTER TABLE [OcorrenciaEtiqueta] ADD FOREIGN KEY ([id_etiqueta]) REFERENCES [Etiqueta] ([id_etiqueta])
GO
