import type { Request, Response } from "express";
export declare function getPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deletePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function patchPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getPostsResponses(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postPostsResponses(req: Request, res: Response): Promise<void>;
export declare function patchPostResponse(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function delePostResponse(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=postsController.d.ts.map