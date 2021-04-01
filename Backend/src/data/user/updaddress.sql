UPDATE [dbo].[Address]
   SET [Type] = @Type
      ,[Zip] = @Zip
      ,[Address] = @Address
      ,[Complement] = @Complement
      ,[City] = @City
      ,[State] = @State
      ,[Reference] = @Reference
      ,[Number] = @Number
      ,[District] = @District
WHERE 
	[Id] = @Id