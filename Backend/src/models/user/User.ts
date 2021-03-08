interface User{
    Id: number;
    Name: string;
    Email: string;
    Password: string;
    UpdateDate : Date
}

export default User;

// class User implements IUser{
//     Id: number;
//     Name: string;
//     Email: string;
//     UpdateDate: Date;

//     constructor(id: number, name: string, email: string, updateDate: Date){
//         this.Id = id;
//         this.Name = name;
//         this.Email = email;
//         this.UpdateDate = updateDate;    
//     }
// }