import { ConflictException } from '@nestjs/common';

export class PostConflictException extends ConflictException {
  constructor(postId: string) {
    super(`Post with id ${postId} does not match`);
  }
}
