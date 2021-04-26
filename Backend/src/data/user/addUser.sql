INSERT INTO [dbo].[User]
(
    [Name]
    ,[Cpf]
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
    ,GETDATE()
    ,@RG
    ,@Birthday
    ,@Mobile
    ,@Phone
)
SELECT @@IDENTITY as ID