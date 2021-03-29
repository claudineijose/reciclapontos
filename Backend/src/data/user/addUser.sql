INSERT INTO [dbo].[User]
(
    [Name]
    ,[Cpf]
    ,[Email]
    ,[UpdateDate]
)
VALUES
(
    @Name
    ,@Cpf
    ,@Email
    ,GETDATE()
)
SELECT @@IDENTITY as ID