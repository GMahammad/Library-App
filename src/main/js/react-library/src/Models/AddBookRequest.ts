class AddBookRequest{
    title:string;
    author:string;
    description:string;
    category:string;
    copies:number;
    img:string;
    constructor(title:string,author:string,description:string,category:string,copies:number,img:string){
        this.title=title;
        this.author=author;
        this.description=description;
        this.category = category;
        this.copies = copies;
        this.img = img;
    }
}
export default AddBookRequest;