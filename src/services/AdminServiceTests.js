/**
 * Admin API Test Utilities
 * 
 * This file contains helper functions to test the Admin API integration.
 * Open browser console and run these functions to verify the API is working.
 * 
 * Example usage:
 * 1. Import this file in a component or run in console
 * 2. Call: testAdminAPI.testConnection()
 * 3. Call: testAdminAPI.runAllTests()
 */

import { AdminService } from './AdminService';

export const testAdminAPI = {
  /**
   * Test database connection
   */
  testConnection: async () => {
    console.log('🔍 Testing database connection...');
    try {
      const result = await AdminService.testConnection();
      console.log('✅ Database connection successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  },

  /**
   * Test getting all users
   */
  testGetUsers: async () => {
    console.log('🔍 Testing get all users...');
    try {
      const users = await AdminService.getAllUsers();
      console.log(`✅ Retrieved ${users.length} users:`, users);
      return users;
    } catch (error) {
      console.error('❌ Get users failed:', error);
      throw error;
    }
  },

  /**
   * Test creating a user
   */
  testCreateUser: async () => {
    console.log('🔍 Testing create user...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      role: 'STUDENT',
      motDePasse: 'testpass123'
    };

    try {
      const createdUser = await AdminService.createUser(testUser);
      console.log('✅ User created successfully:', createdUser);
      return createdUser;
    } catch (error) {
      console.error('❌ Create user failed:', error);
      throw error;
    }
  },

  /**
   * Test updating a user
   */
  testUpdateUser: async (userId) => {
    if (!userId) {
      console.log('⚠️  No user ID provided. Creating a test user first...');
      const user = await testAdminAPI.testCreateUser();
      userId = user.id;
    }

    console.log(`🔍 Testing update user (ID: ${userId})...`);
    const updateData = {
      username: `updated_user_${Date.now()}`,
      email: `updated${Date.now()}@example.com`,
      role: 'TEACHER',
      motDePasse: 'newpass123'
    };

    try {
      const updatedUser = await AdminService.updateUser(userId, updateData);
      console.log('✅ User updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Update user failed:', error);
      throw error;
    }
  },

  /**
   * Test deleting a user
   */
  testDeleteUser: async (userId) => {
    if (!userId) {
      console.log('⚠️  No user ID provided. Creating a test user first...');
      const user = await testAdminAPI.testCreateUser();
      userId = user.id;
    }

    console.log(`🔍 Testing delete user (ID: ${userId})...`);
    try {
      await AdminService.deleteUser(userId);
      console.log('✅ User deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Delete user failed:', error);
      throw error;
    }
  },

  /**
   * Test getting all courses
   */
  testGetCourses: async () => {
    console.log('🔍 Testing get all courses...');
    try {
      const courses = await AdminService.getAllCourses();
      console.log(`✅ Retrieved ${courses.length} courses:`, courses);
      return courses;
    } catch (error) {
      console.error('❌ Get courses failed:', error);
      throw error;
    }
  },

  /**
   * Test getting pending courses
   */
  testGetPendingCourses: async () => {
    console.log('🔍 Testing get pending courses...');
    try {
      const courses = await AdminService.getPendingCourses();
      console.log(`✅ Retrieved ${courses.length} pending courses:`, courses);
      return courses;
    } catch (error) {
      console.error('❌ Get pending courses failed:', error);
      throw error;
    }
  },

  /**
   * Test creating a course
   */
  testCreateCourse: async () => {
    console.log('🔍 Testing create course...');
    const testCourse = {
      titre: `Test Course ${Date.now()}`,
      description: 'This is a test course created by the API test utility'
    };

    try {
      const createdCourse = await AdminService.createCourse(testCourse);
      console.log('✅ Course created successfully:', createdCourse);
      return createdCourse;
    } catch (error) {
      console.error('❌ Create course failed:', error);
      throw error;
    }
  },

  /**
   * Test approving a course
   */
  testApproveCourse: async (courseId) => {
    if (!courseId) {
      console.log('⚠️  No course ID provided. Creating a test course first...');
      const course = await testAdminAPI.testCreateCourse();
      courseId = course.id;
    }

    console.log(`🔍 Testing approve course (ID: ${courseId})...`);
    try {
      const approvedCourse = await AdminService.approveCourse(courseId);
      console.log('✅ Course approved successfully:', approvedCourse);
      console.log(`   valideParAdmin: ${approvedCourse.valideParAdmin}`);
      return approvedCourse;
    } catch (error) {
      console.error('❌ Approve course failed:', error);
      throw error;
    }
  },

  /**
   * Test rejecting a course
   */
  testRejectCourse: async (courseId) => {
    if (!courseId) {
      console.log('⚠️  No course ID provided. Creating a test course first...');
      const course = await testAdminAPI.testCreateCourse();
      courseId = course.id;
    }

    console.log(`🔍 Testing reject course (ID: ${courseId})...`);
    try {
      const rejectedCourse = await AdminService.rejectCourse(courseId);
      console.log('✅ Course rejected successfully:', rejectedCourse);
      console.log(`   valideParAdmin: ${rejectedCourse.valideParAdmin}`);
      return rejectedCourse;
    } catch (error) {
      console.error('❌ Reject course failed:', error);
      throw error;
    }
  },

  /**
   * Run all tests sequentially
   */
  runAllTests: async () => {
    console.log('🚀 Running all Admin API tests...\n');
    
    const results = {
      passed: 0,
      failed: 0,
      tests: []
    };

    const tests = [
      { name: 'Database Connection', fn: () => testAdminAPI.testConnection() },
      { name: 'Get All Users', fn: () => testAdminAPI.testGetUsers() },
      { name: 'Get All Courses', fn: () => testAdminAPI.testGetCourses() },
      { name: 'Get Pending Courses', fn: () => testAdminAPI.testGetPendingCourses() },
      { name: 'Create User', fn: () => testAdminAPI.testCreateUser() },
      { name: 'Create Course', fn: () => testAdminAPI.testCreateCourse() },
    ];

    for (const test of tests) {
      console.log(`\n${'='.repeat(50)}`);
      try {
        await test.fn();
        results.passed++;
        results.tests.push({ name: test.name, status: 'PASSED' });
      } catch (error) {
        results.failed++;
        results.tests.push({ name: test.name, status: 'FAILED', error: error.message });
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 Test Results Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📝 Total: ${results.tests.length}`);
    console.log(`\nDetailed Results:`);
    results.tests.forEach((test, i) => {
      const icon = test.status === 'PASSED' ? '✅' : '❌';
      console.log(`${i + 1}. ${icon} ${test.name} - ${test.status}`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    return results;
  },

  /**
   * Test full CRUD cycle for users
   */
  testUserCRUD: async () => {
    console.log('🔄 Testing full User CRUD cycle...\n');

    try {
      // Create
      console.log('1️⃣ Creating user...');
      const created = await testAdminAPI.testCreateUser();
      const userId = created.id;

      // Read
      console.log('\n2️⃣ Reading users...');
      await testAdminAPI.testGetUsers();

      // Update
      console.log('\n3️⃣ Updating user...');
      await testAdminAPI.testUpdateUser(userId);

      // Delete
      console.log('\n4️⃣ Deleting user...');
      await testAdminAPI.testDeleteUser(userId);

      console.log('\n✅ User CRUD cycle completed successfully!');
      return true;
    } catch (error) {
      console.error('\n❌ User CRUD cycle failed:', error);
      throw error;
    }
  },

  /**
   * Test full course approval workflow
   */
  testCourseWorkflow: async () => {
    console.log('🔄 Testing full Course approval workflow...\n');

    try {
      // Create course
      console.log('1️⃣ Creating course...');
      const course = await testAdminAPI.testCreateCourse();
      const courseId = course.id;
      console.log(`   Initial valideParAdmin: ${course.valideParAdmin}`);

      // Get pending courses
      console.log('\n2️⃣ Getting pending courses...');
      const pending = await testAdminAPI.testGetPendingCourses();
      const isPending = pending.some(c => c.id === courseId);
      console.log(`   Course is in pending list: ${isPending}`);

      // Approve course
      console.log('\n3️⃣ Approving course...');
      const approved = await testAdminAPI.testApproveCourse(courseId);

      // Verify not in pending anymore
      console.log('\n4️⃣ Verifying approval...');
      const stillPending = await testAdminAPI.testGetPendingCourses();
      const isStillPending = stillPending.some(c => c.id === courseId);
      console.log(`   Course still in pending list: ${isStillPending}`);

      // Reject course
      console.log('\n5️⃣ Rejecting course...');
      const rejected = await testAdminAPI.testRejectCourse(courseId);

      // Verify back in pending
      console.log('\n6️⃣ Verifying rejection...');
      const backToPending = await testAdminAPI.testGetPendingCourses();
      const isBackInPending = backToPending.some(c => c.id === courseId);
      console.log(`   Course back in pending list: ${isBackInPending}`);

      console.log('\n✅ Course approval workflow completed successfully!');
      return true;
    } catch (error) {
      console.error('\n❌ Course approval workflow failed:', error);
      throw error;
    }
  }
};

// Make it available globally in console for easy testing
if (typeof window !== 'undefined') {
  window.testAdminAPI = testAdminAPI;
  console.log('💡 Admin API test utilities loaded!');
  console.log('   Run: testAdminAPI.runAllTests()');
  console.log('   Or: testAdminAPI.testConnection()');
  console.log('   Or: testAdminAPI.testUserCRUD()');
  console.log('   Or: testAdminAPI.testCourseWorkflow()');
}

export default testAdminAPI;
