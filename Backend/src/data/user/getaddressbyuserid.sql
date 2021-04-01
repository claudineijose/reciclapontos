SELECT A.[Id]
      ,A.[Type] AS [AddressType]
      ,A.[Zip]
      ,A.[Address]
      ,A.[Number]
      ,A.[Complement]
      ,A.[District]
      ,A.[City]
      ,A.[State]
      ,A.[Reference]
FROM [dbo].[Address] A 
WHERE
	A.[UserId] = @Id  