export interface IFile {
    
    md5: string;
    fileName: string;   
    user: { sender: string, receiver: string };
    length: number;
    path : string;
    createDate :number;
    hitTimes : number;
    lastHitDate : number;
}

export interface IRequestValue{
    ts:number,
    md5:string;
}

export interface IResult<T> {
    ret: number;
    success: boolean;
    msg: string;
    data: T;
}