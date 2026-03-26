import type { Request, Response } from "express";
export declare function getCategories(req: Request, res: Response): Promise<void>;
export declare function getCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postCategory(req: Request, res: Response): Promise<void>;
export declare function patchCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=categoryController.d.ts.map