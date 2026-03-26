import type { Request, Response } from "express";
export declare function getTeamChoicePosts(req: Request, res: Response): Promise<void>;
export declare function getTeamChoicePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postTeamChoicePosts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteTeamChoicePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=teamChoicePostsController.d.ts.map