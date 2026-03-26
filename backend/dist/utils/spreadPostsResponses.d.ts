interface Response {
    id: number;
    userId: number;
    postId: number;
    parentId: null | number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    replies?: Response[];
}
export declare function getAllOnePostResponses(postId: number): Promise<Response[] | undefined>;
export {};
//# sourceMappingURL=spreadPostsResponses.d.ts.map