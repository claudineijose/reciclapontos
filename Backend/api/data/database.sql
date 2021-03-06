CREATE TABLE Usuario (
	Id BIGINT IDENTITY(1,1),
	Nome VARCHAR(50),
	Email VARCHAR(100),
	DataAlteracao SMALLDATETIME,
	CONSTRAINT PK_Usuario PRIMARY KEY (Id)
)

CREATE TABLE TipoAutenticacao (
	UsuarioId BIGINT,
	Tipo CHAR(1) CHECK (Tipo IN ('F', 'G', 'S')), -- F - Facebook, G - Gmail, S - Autenticação com Senha
	Senha VARCHAR(1000),
	CONSTRAINT PK_TipoAutenticao PRIMARY KEY (UsuarioId, Tipo),
	CONSTRAINT FK_TipoAutenticacao_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuario (Id)	
)

CREATE TABLE Endereco(
	Id BIGINT IDENTITY(1,1),
	UsuarioId BIGINT,
	Tipo CHAR(1) CHECK (Tipo IN ('R', 'C', 'O')), -- R - Residencial, C - Comercial, O - Outros
	CEP VARCHAR(9),
	Endereco VARCHAR(50),
	Complemento VARCHAR(100),
	Cidade VARCHAR(50),
	Estado VARCHAR(2),
	Referencia VARCHAR(1000),
	CONSTRAINT PK_Endereco PRIMARY KEY (Id),
	CONSTRAINT FK_Endereco_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuario (Id)
)
