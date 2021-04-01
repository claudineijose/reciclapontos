INSERT INTO [dbo].[User]
(
    [Name]
    ,[Cpf]
    ,[Email]
    ,[UpdateDate]
    ,[RG]
    ,[Birthday]
    ,[Mobile]
    ,[Phone]
)
VALUES
(
    @Name
    ,@Cpf
    ,@Email
    ,GETDATE()
    ,@RG
    ,@Birthday
    ,@Mobile
    ,@Phone
)
SELECT @@IDENTITY as ID