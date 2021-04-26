UPDATE 
	[dbo].[User]
SET 
	[Name] = @Name
	,[Cpf] = @Cpf
    ,[UpdateDate] = GETDATE()
	,[RG] = @RG
    ,[Birthday] = @Birthday
    ,[Mobile] = @Mobile
    ,[Phone] = @Phone
WHERE 
	[Id] = @Id

SELECT @Id as ID