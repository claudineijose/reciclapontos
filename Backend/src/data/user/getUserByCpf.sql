SELECT U.[Id]
      ,U.[Name]
      ,U.[Cpf]
      ,U.[Email]
      ,U.[UpdateDate]
	,T.[Type] AS [AuthType]
      ,T.[Password]
      ,A.[Type] AS [AddressType]
      ,A.[Zip]
      ,A.[Address]
      ,A.[Complement]
      ,A.[City]
      ,A.[State]
      ,A.[Reference]
FROM [dbo].[User] U
LEFT JOIN [dbo].[AuthType] T ON U.[Id] = T.[UserId] 
LEFT JOIN [dbo].[Address] A ON U.[Id] = A.[UserId] 
WHERE
    U.[Cpf] = @Cpf