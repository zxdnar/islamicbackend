const express = require('express');
const router = express.Router();

// Mock data for now - will be replaced with MongoDB
let contentData = {
  duas: [
    {
      id: 1,
      title: "Dua for Morning",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
      translation: "We have reached the morning and at this very time all sovereignty belongs to Allah",
      category: "morning",
      audioUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Dua for Evening",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
      translation: "We have reached the evening and at this very time all sovereignty belongs to Allah",
      category: "evening",
      audioUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  ruqya: [
    {
      id: 1,
      title: "Ruqya for Protection",
      description: "Powerful ruqya for protection from evil eye and black magic",
      videoUrl: "https://example.com/ruqya-protection.mp4",
      duration: "15:30",
      category: "protection",
      thumbnail: "https://example.com/thumbnail1.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  books: [
    {
      id: 1,
      title: "The Book of Tawheed",
      author: "Muhammad ibn Abdul Wahhab",
      description: "A comprehensive book about Islamic monotheism",
      pdfUrl: "https://example.com/tawheed.pdf",
      coverImage: "https://example.com/tawheed-cover.jpg",
      category: "aqeedah",
      pages: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

// Get all duas
router.get('/duas', (req, res) => {
  try {
    const { category, search } = req.query;
    let duas = contentData.duas;

    // Filter by category
    if (category) {
      duas = duas.filter(dua => dua.category === category);
    }

    // Search by title or translation
    if (search) {
      const searchLower = search.toLowerCase();
      duas = duas.filter(dua => 
        dua.title.toLowerCase().includes(searchLower) ||
        dua.translation.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: duas,
      count: duas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch duas',
      message: error.message
    });
  }
});

// Get single dua
router.get('/duas/:id', (req, res) => {
  try {
    const dua = contentData.duas.find(d => d.id === parseInt(req.params.id));
    if (!dua) {
      return res.status(404).json({
        success: false,
        error: 'Dua not found'
      });
    }
    res.json({
      success: true,
      data: dua
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dua',
      message: error.message
    });
  }
});

// Add new dua
router.post('/duas', (req, res) => {
  try {
    const { title, arabic, translation, category, audioUrl } = req.body;
    
    if (!title || !arabic || !translation) {
      return res.status(400).json({
        success: false,
        error: 'Title, Arabic text, and translation are required'
      });
    }

    const newDua = {
      id: contentData.duas.length + 1,
      title,
      arabic,
      translation,
      category: category || 'general',
      audioUrl: audioUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contentData.duas.push(newDua);

    res.status(201).json({
      success: true,
      data: newDua,
      message: 'Dua added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add dua',
      message: error.message
    });
  }
});

// Get all ruqya videos
router.get('/ruqya', (req, res) => {
  try {
    const { category, search } = req.query;
    let ruqya = contentData.ruqya;

    if (category) {
      ruqya = ruqya.filter(video => video.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      ruqya = ruqya.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: ruqya,
      count: ruqya.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ruqya videos',
      message: error.message
    });
  }
});

// Add new ruqya video
router.post('/ruqya', (req, res) => {
  try {
    const { title, description, videoUrl, duration, category, thumbnail } = req.body;
    
    if (!title || !description || !videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and video URL are required'
      });
    }

    const newRuqya = {
      id: contentData.ruqya.length + 1,
      title,
      description,
      videoUrl,
      duration: duration || '00:00',
      category: category || 'general',
      thumbnail: thumbnail || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contentData.ruqya.push(newRuqya);

    res.status(201).json({
      success: true,
      data: newRuqya,
      message: 'Ruqya video added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add ruqya video',
      message: error.message
    });
  }
});

// Get all books
router.get('/books', (req, res) => {
  try {
    const { category, search } = req.query;
    let books = contentData.books;

    if (category) {
      books = books.filter(book => book.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books',
      message: error.message
    });
  }
});

// Add new book
router.post('/books', (req, res) => {
  try {
    const { title, author, description, pdfUrl, coverImage, category, pages } = req.body;
    
    if (!title || !author || !description || !pdfUrl) {
      return res.status(400).json({
        success: false,
        error: 'Title, author, description, and PDF URL are required'
      });
    }

    const newBook = {
      id: contentData.books.length + 1,
      title,
      author,
      description,
      pdfUrl,
      coverImage: coverImage || null,
      category: category || 'general',
      pages: pages || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contentData.books.push(newBook);

    res.status(201).json({
      success: true,
      data: newBook,
      message: 'Book added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add book',
      message: error.message
    });
  }
});

// Get content statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      duas: contentData.duas.length,
      ruqya: contentData.ruqya.length,
      books: contentData.books.length,
      total: contentData.duas.length + contentData.ruqya.length + contentData.books.length,
      categories: {
        duas: [...new Set(contentData.duas.map(d => d.category))],
        ruqya: [...new Set(contentData.ruqya.map(r => r.category))],
        books: [...new Set(contentData.books.map(b => b.category))]
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router; 