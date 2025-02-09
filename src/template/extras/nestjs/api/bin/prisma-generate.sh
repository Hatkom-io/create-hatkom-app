prisma generate && 
bun bin/fix-zod-imports.ts && 
rm -rf ../web/src/@generated && 
mkdir ../web/src/@generated && 
cp -r src/@generated/zod ../web/src/@generated/zod
