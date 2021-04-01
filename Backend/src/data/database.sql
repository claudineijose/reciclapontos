CREATE TABLE [dbo].[Address](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NULL,
	[Type] [char](1) NULL,
	[Zip] [varchar](9) NULL,
	[Address] [varchar](50) NULL,
	[Number] [varchar]](8) NULL,
	[Complement] [varchar](100) NULL,
	[District] [varchar](30) NULL,
	[City] [varchar](50) NULL,
	[State] [varchar](2) NULL,
	[Reference] [varchar](1000) NULL,
 CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_User]
GO

ALTER TABLE [dbo].[Address]  WITH CHECK ADD CHECK [Address_Check](([Type]='O' OR [Type]='C' OR [Type]='R'))
GO

CREATE TABLE [dbo].[AuthType](
	[UserId] [bigint] NOT NULL,
	[Type] [char](1) NOT NULL,
	[Password] [varchar](1000) NULL,
 CONSTRAINT [PK_AuthType] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[AuthType]  WITH CHECK ADD  CONSTRAINT [FK_AuthType_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

ALTER TABLE [dbo].[AuthType] CHECK CONSTRAINT [FK_AuthType_User]
GO

ALTER TABLE [dbo].[AuthType] ADD CONSTRAINT [AuthType_CK_01] CHECK  (([Type]='P' OR [Type]='G' OR [Type]='F'))

GO

CREATE TABLE [dbo].[User](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[CPF] [varchar](14) NULL,
	[RG] [varchar](14) NULL,
	[Name] [varchar](50) NULL,
	[Email] [varchar](100) NULL,
	[Birthday] [smalldatetime] NULL,
	[Mobile] [varchar] (14),
	[Phone] [varchar] (14),
	[UpdateDate] [smalldatetime] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

