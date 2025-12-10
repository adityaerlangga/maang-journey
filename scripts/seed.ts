import pool from '../lib/db';
import { Priority, Progress } from '../types/todo';

interface SeedTodo {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  progress: Progress;
}

const seedTodos: SeedTodo[] = [
  // Algorithm Patterns & Techniques
  {
    title: 'Master Two Pointers Pattern',
    description: 'Learn and practice problems using two pointers technique. Essential for array and string problems.',
    category: 'Algorithms',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Sliding Window Pattern',
    description: 'Understand sliding window technique for substring and subarray problems.',
    category: 'Algorithms',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Binary Search',
    description: 'Practice binary search variations: finding boundaries, rotated arrays, and search in 2D arrays.',
    category: 'Algorithms',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Dynamic Programming',
    description: 'Learn DP patterns: 1D DP, 2D DP, knapsack, longest common subsequence, and more.',
    category: 'Algorithms',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Backtracking',
    description: 'Practice backtracking problems: permutations, combinations, N-Queens, Sudoku solver.',
    category: 'Algorithms',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Master Graph Algorithms',
    description: 'Learn BFS, DFS, topological sort, shortest path (Dijkstra), and minimum spanning tree.',
    category: 'Algorithms',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Greedy Algorithms',
    description: 'Understand greedy approach for optimization problems like activity selection, interval scheduling.',
    category: 'Algorithms',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Master Trie Data Structure',
    description: 'Learn and implement Trie for prefix matching, autocomplete, and word search problems.',
    category: 'Data Structures',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Master Union-Find (Disjoint Set)',
    description: 'Learn Union-Find data structure for connectivity problems and cycle detection.',
    category: 'Data Structures',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Master Heap/Priority Queue',
    description: 'Practice problems using min-heap and max-heap: Kth largest, merge K sorted lists, etc.',
    category: 'Data Structures',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Hash Tables',
    description: 'Deep dive into hash tables: collision handling, design hash map, and frequency counting problems.',
    category: 'Data Structures',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Trees (Binary Trees)',
    description: 'Practice tree traversals, tree construction, LCA, tree diameter, and tree validation problems.',
    category: 'Data Structures',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Master Linked Lists',
    description: 'Practice linked list problems: reversal, cycle detection, merging, and partitioning.',
    category: 'Data Structures',
    priority: 'medium',
    progress: 'not_started',
  },
  
  // Popular LeetCode Problems
  {
    title: 'LeetCode #1: Two Sum',
    description: 'Classic hash map problem. Understand the optimal O(n) solution.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #15: 3Sum',
    description: 'Two pointers problem. Important pattern for array problems.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #53: Maximum Subarray (Kadane\'s Algorithm)',
    description: 'Classic DP problem. Understand Kadane\'s algorithm.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #121: Best Time to Buy and Sell Stock',
    description: 'Dynamic programming / greedy problem. Multiple variations exist.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #206: Reverse Linked List',
    description: 'Fundamental linked list problem. Practice iterative and recursive solutions.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #238: Product of Array Except Self',
    description: 'Array manipulation problem. No division allowed.',
    category: 'LeetCode',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #3: Longest Substring Without Repeating Characters',
    description: 'Sliding window problem. Important for string manipulation.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #20: Valid Parentheses',
    description: 'Stack problem. Classic interview question.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #56: Merge Intervals',
    description: 'Sorting and interval merging. Common pattern in interviews.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #70: Climbing Stairs',
    description: 'Classic DP problem. Understand memoization and tabulation.',
    category: 'LeetCode',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #102: Binary Tree Level Order Traversal',
    description: 'BFS on trees. Important for tree problems.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #200: Number of Islands',
    description: 'DFS/BFS on grid. Graph traversal problem.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #215: Kth Largest Element in Array',
    description: 'Quickselect or heap problem. Important for understanding selection algorithms.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #297: Serialize and Deserialize Binary Tree',
    description: 'Tree serialization. Tests understanding of tree traversal.',
    category: 'LeetCode',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #322: Coin Change',
    description: 'Classic DP problem. Unbounded knapsack variant.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'LeetCode #42: Trapping Rain Water',
    description: 'Two pointers problem. Advanced array manipulation.',
    category: 'LeetCode',
    priority: 'high',
    progress: 'not_started',
  },
  
  // System Design Topics
  {
    title: 'Design URL Shortener (TinyURL)',
    description: 'Design a URL shortening service like bit.ly. Focus on scalability, load balancing, and database design.',
    category: 'System Design',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Design Twitter/X Feed',
    description: 'Design a social media feed system. Handle real-time updates, fan-out patterns, and caching strategies.',
    category: 'System Design',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Design Distributed Cache',
    description: 'Design a distributed caching system like Redis. Understand consistency, eviction policies, and sharding.',
    category: 'System Design',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Design Rate Limiter',
    description: 'Design a rate limiting system. Implement token bucket, sliding window, or fixed window algorithms.',
    category: 'System Design',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Design Search Engine',
    description: 'Design a search engine like Google. Understand indexing, ranking, and distributed search.',
    category: 'System Design',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Design Notification System',
    description: 'Design a notification system that can handle millions of notifications. Focus on queuing and delivery.',
    category: 'System Design',
    priority: 'medium',
    progress: 'not_started',
  },
  
  // Projects & Practice
  {
    title: 'Build a Full-Stack Project',
    description: 'Create a full-stack application showcasing your skills. Use modern tech stack and deploy it.',
    category: 'Projects',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Contribute to Open Source',
    description: 'Find an open source project and make meaningful contributions. Great for building portfolio.',
    category: 'Projects',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Practice Mock Interviews',
    description: 'Schedule regular mock interviews. Practice explaining your thought process clearly.',
    category: 'Interview Prep',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Prepare Behavioral Questions (STAR Method)',
    description: 'Prepare answers for common behavioral questions using STAR method. Practice storytelling.',
    category: 'Interview Prep',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Review System Design Fundamentals',
    description: 'Study CAP theorem, load balancing, caching strategies, database scaling, and microservices.',
    category: 'System Design',
    priority: 'high',
    progress: 'not_started',
  },
  {
    title: 'Study Database Concepts',
    description: 'Deep dive into SQL vs NoSQL, indexing, transactions, ACID properties, and database optimization.',
    category: 'System Design',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Learn Concurrency & Multithreading',
    description: 'Understand threads, locks, deadlocks, race conditions, and concurrent programming patterns.',
    category: 'Computer Science',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Study Operating Systems Fundamentals',
    description: 'Review processes, memory management, file systems, and OS scheduling algorithms.',
    category: 'Computer Science',
    priority: 'medium',
    progress: 'not_started',
  },
  {
    title: 'Review Network Protocols',
    description: 'Study HTTP/HTTPS, TCP/IP, DNS, REST vs GraphQL, and WebSocket protocols.',
    category: 'Computer Science',
    priority: 'medium',
    progress: 'not_started',
  },
];

async function seedDatabase() {
  try {
    const connection = await pool.getConnection();
    
    console.log('Starting database seeding...');
    
    // Check if todos already exist
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM todos');
    const count = (existing as any[])[0].count;
    
    if (count > 0) {
      console.log(`Database already has ${count} todos. Skipping seed to avoid duplicates.`);
      console.log('If you want to re-seed, please clear the todos table first.');
      connection.release();
      return;
    }
    
    // Insert seed todos
    const query = `
      INSERT INTO todos (title, description, category, priority, progress)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    let inserted = 0;
    for (const todo of seedTodos) {
      await connection.query(query, [
        todo.title,
        todo.description,
        todo.category,
        todo.priority,
        todo.progress,
      ]);
      inserted++;
    }
    
    connection.release();
    
    console.log(`✅ Successfully seeded ${inserted} todos!`);
    console.log('\nCategories created:');
    const categories = [...new Set(seedTodos.map(t => t.category))];
    categories.forEach(cat => {
      const count = seedTodos.filter(t => t.category === cat).length;
      console.log(`  - ${cat}: ${count} todos`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

main();

