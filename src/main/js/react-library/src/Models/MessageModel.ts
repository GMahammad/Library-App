class MessageModel{
    id?:number;
    userEmail?:string;
    adminEmail?:string;
    response?:string;
    closed?:boolean;
    title:string;
    question:string;  

    constructor(title:string,question:string){
        this.title = title;
        this.question = question;
    }

}

export default MessageModel;
