export interface CommentRequest
{
    IdeaId: number
    description: string
    username?: string
    id?: number
    like?: number
    createdAt?:Date
    User?: {username:string}
}