INSERT INTO [dbo].[AuthType]
           ([UserId]
           ,[Type]
           ,[Password]
           ,[OAuthId]
           ,[Email])
     VALUES
           (@UserId
           ,@Type
           ,@Password
           ,@OAuthId
           ,@Email)