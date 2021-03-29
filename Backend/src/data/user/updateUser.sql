UPDATE 
	[dbo].[User]
SET 
	[Name] = @Name
	,[Cpf] = @Cpf
    ,[Email] = @Email
    ,[UpdateDate] = GETDATE()
WHERE 
	[Id] = @Id

SELECT @Id as ID