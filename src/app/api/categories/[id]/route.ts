// src/app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/utils';

// --- RENAME CATEGORY ---
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categoryId = params.id;
  const { name, type } = await request.json(); // Get the new name and type from the request body

  if (!name && !type) {
    return NextResponse.json(
      { error: 'Name or type is required' },
      { status: 400 }
    );
  }

  try {
    // Security: Update only if the category belongs to the current user
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
        userId: user.id, // <-- Critical security check
      },
      data: {
        name: name || undefined, // Only update if name is provided
        type: type || undefined, // Only update if type is provided
      },
    });
    return NextResponse.json(updatedCategory);
  } catch {
    return NextResponse.json(
      { error: 'Category not found or update failed' },
      { status: 404 }
    );
  }
}

// --- DELETE CATEGORY ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categoryId = params.id;

  try {
    // Security: Delete only if the category belongs to the current user
    await prisma.category.delete({
      where: {
        id: categoryId,
        userId: user.id, // <-- Critical security check
      },
    });
    // Thanks to `ON DELETE SET NULL` in our schema, Prisma/Postgres will handle
    // setting the `categoryId` to null on all related transactions automatically.

    return new NextResponse(null, { status: 204 }); // 204 No Content is standard for successful DELETE
  } catch {
    return NextResponse.json(
      { error: 'Category not found or delete failed' },
      { status: 404 }
    );
  }
}
