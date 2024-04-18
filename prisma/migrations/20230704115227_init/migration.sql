-- CreateTable
CREATE TABLE "Scheme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "backgroundTheme" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "zan" INTEGER NOT NULL DEFAULT 0,
    "star" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "free" BOOLEAN NOT NULL DEFAULT true,
    "price" DECIMAL(65,30),
    "initial" TEXT NOT NULL DEFAULT '#',
    "sortLevel" SERIAL NOT NULL,
    "resource" TEXT NOT NULL DEFAULT '',
    "detail" JSONB NOT NULL,
    "enjoyAddress" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Scheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchemeTheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "SchemeTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuitableAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "SuitableAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuitableDepartment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "SuitableDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swiper" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "btnText" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "Swiper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaId" TEXT,
    "schemeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortLevel" SERIAL NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SchemeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SchemeToSchemeTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SchemeToSuitableAudience" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SchemeToSuitableDepartment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_code_key" ON "Area"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToTag_AB_unique" ON "_SchemeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToTag_B_index" ON "_SchemeToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToSchemeTheme_AB_unique" ON "_SchemeToSchemeTheme"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToSchemeTheme_B_index" ON "_SchemeToSchemeTheme"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToSuitableAudience_AB_unique" ON "_SchemeToSuitableAudience"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToSuitableAudience_B_index" ON "_SchemeToSuitableAudience"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SchemeToSuitableDepartment_AB_unique" ON "_SchemeToSuitableDepartment"("A", "B");

-- CreateIndex
CREATE INDEX "_SchemeToSuitableDepartment_B_index" ON "_SchemeToSuitableDepartment"("B");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToTag" ADD CONSTRAINT "_SchemeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToTag" ADD CONSTRAINT "_SchemeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeTheme" ADD CONSTRAINT "_SchemeToSchemeTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSchemeTheme" ADD CONSTRAINT "_SchemeToSchemeTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "SchemeTheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSuitableAudience" ADD CONSTRAINT "_SchemeToSuitableAudience_A_fkey" FOREIGN KEY ("A") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSuitableAudience" ADD CONSTRAINT "_SchemeToSuitableAudience_B_fkey" FOREIGN KEY ("B") REFERENCES "SuitableAudience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSuitableDepartment" ADD CONSTRAINT "_SchemeToSuitableDepartment_A_fkey" FOREIGN KEY ("A") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchemeToSuitableDepartment" ADD CONSTRAINT "_SchemeToSuitableDepartment_B_fkey" FOREIGN KEY ("B") REFERENCES "SuitableDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
