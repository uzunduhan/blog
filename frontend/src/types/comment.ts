export interface Comment {
  id: number;
  text: string;
  createdDate: string;
  username: string;
}

export interface CreateCommentPayload {
  text: string;
}
