INSERT INTO [dbo].[Address]
           ([UserId]
           ,[Type]
           ,[Zip]
           ,[Address]
           ,[Number]
           ,[Complement]
           ,[District]
           ,[City]
           ,[State]
           ,[Reference])
     VALUES
           (@UserId
           ,@Type
           ,@Zip
           ,@Address
           ,@Number
           ,@Complement
           ,@District
           ,@City
           ,@State
           ,@Reference)