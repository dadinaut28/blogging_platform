-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_postId_fkey";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
