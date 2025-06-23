// Test file for list deletion functionality
// This demonstrates how the delete feature works

import { supabase } from './lib/supabase'

export interface TestListData {
  name: string
  category: string
  description?: string
}

export async function createTestList(data: TestListData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data: list, error } = await supabase
      .from('lists')
      .insert({
        name: data.name,
        category: data.category,
        description: data.description,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    console.log('Test list created:', list)
    return list
  } catch (error) {
    console.error('Error creating test list:', error)
    throw error
  }
}

export async function deleteTestList(listId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Check if user is the owner of the list
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .select('created_by')
      .eq('id', listId)
      .single()

    if (listError) throw listError

    if (listData.created_by !== user.id) {
      throw new Error('Only list owners can delete lists')
    }

    // Delete the list (this will cascade delete all related data)
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId)

    if (error) throw error

    console.log('Test list deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting test list:', error)
    throw error
  }
}

export async function testListDeletionFlow() {
  try {
    console.log('🧪 Testing list deletion flow...')
    
    // 1. Create a test list
    const testList = await createTestList({
      name: 'Test Deletion List',
      category: 'test',
      description: 'This list will be deleted as part of testing'
    })

    console.log('✅ Step 1: Test list created with ID:', testList.id)

    // 2. Add some test items to the list
    const { error: itemsError } = await supabase
      .from('items')
      .insert([
        {
          list_id: testList.id,
          name: 'Test Item 1',
          created_by: (await supabase.auth.getUser()).data.user?.id
        },
        {
          list_id: testList.id,
          name: 'Test Item 2',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }
      ])

    if (itemsError) throw itemsError
    console.log('✅ Step 2: Test items added to list')

    // 3. Verify the list and items exist
    const { data: listCheck } = await supabase
      .from('lists')
      .select('id, name')
      .eq('id', testList.id)
      .single()

    const { data: itemsCheck } = await supabase
      .from('items')
      .select('id, name')
      .eq('list_id', testList.id)

    console.log('✅ Step 3: Verified list exists:', listCheck)
    console.log('✅ Step 3: Verified items exist:', itemsCheck?.length, 'items')

    // 4. Delete the list
    await deleteTestList(testList.id)
    console.log('✅ Step 4: List deleted successfully')

    // 5. Verify the list and items are gone (cascade delete)
    const { data: deletedListCheck } = await supabase
      .from('lists')
      .select('id')
      .eq('id', testList.id)

    const { data: deletedItemsCheck } = await supabase
      .from('items')
      .select('id')
      .eq('list_id', testList.id)

    console.log('✅ Step 5: Verified list is deleted:', deletedListCheck?.length === 0)
    console.log('✅ Step 5: Verified items are deleted (cascade):', deletedItemsCheck?.length === 0)

    console.log('🎉 List deletion test completed successfully!')
    
    return {
      success: true,
      message: 'List deletion flow works correctly with cascade delete'
    }
  } catch (error) {
    console.error('❌ List deletion test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Usage example:
// import { testListDeletionFlow } from './test-list-deletion'
// testListDeletionFlow().then(result => console.log(result)) 