INSERT INTO [dbo].[Address]
           ([UserId]
           ,[Type]
           ,[Zip]
           ,[Address]
           ,[Complement]
           ,[City]
           ,[State]
           ,[Reference])
     VALUES
           (@UserId
           ,@Type
           ,@Zip
           ,@Address
           ,@Complement
           ,@City
           ,@State
           ,@Reference)