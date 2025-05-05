const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")

// @route   POST api/ai/generate
// @desc    Generate content using AI
// @access  Private
router.post("/generate", auth, async (req, res) => {
  try {
    const { topic, level, contentType } = req.body

    // Mock AI-generated content based on input parameters
    let content = ""

    if (contentType === "notes") {
      content = generateNotes(topic, level)
    } else if (contentType === "quiz") {
      content = generateQuiz(topic, level)
    } else if (contentType === "lesson") {
      content = generateLessonPlan(topic, level)
    } else {
      return res.status(400).json({ message: "Invalid content type" })
    }

    res.json({ content })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Helper functions to generate mock content
function generateNotes(topic, level) {
  const complexity = level === "beginner" ? "basic" : level === "intermediate" ? "intermediate" : "advanced"

  return `# ${topic.toUpperCase()} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level Notes

## Introduction
This document provides ${complexity} information about ${topic}.

## Key Concepts
1. First important concept about ${topic}
2. Second important concept about ${topic}
3. Third important concept about ${topic}

## Detailed Explanation
${topic} is a fascinating subject that involves many aspects. At the ${level} level, it's important to understand the fundamental principles.

### Sub-topic 1
Detailed information about the first sub-topic...

### Sub-topic 2
Detailed information about the second sub-topic...

## Summary
In conclusion, ${topic} at the ${level} level encompasses these key points...

## Additional Resources
- Resource 1
- Resource 2
- Resource 3`
}

function generateQuiz(topic, level) {
  const difficulty = level === "beginner" ? "easy" : level === "intermediate" ? "moderate" : "challenging"

  return `# ${topic.toUpperCase()} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level Quiz

## Instructions
This quiz contains ${difficulty} questions about ${topic}. Select the best answer for each question.

## Questions

### Question 1
What is the primary concept of ${topic}?
A) First option
B) Second option
C) Third option
D) Fourth option

### Question 2
Which of the following best describes the relationship between ${topic} and related concepts?
A) First option
B) Second option
C) Third option
D) Fourth option

### Question 3
In what scenario would you apply ${topic} principles?
A) First option
B) Second option
C) Third option
D) Fourth option

### Question 4
What is the historical significance of ${topic}?
A) First option
B) Second option
C) Third option
D) Fourth option

### Question 5
How does ${topic} impact modern applications?
A) First option
B) Second option
C) Third option
D) Fourth option

## Answer Key
1. C
2. A
3. D
4. B
5. A`
}

function generateLessonPlan(topic, level) {
  const duration = level === "beginner" ? "30 minutes" : level === "intermediate" ? "45 minutes" : "60 minutes"

  return `# ${topic.toUpperCase()} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level Lesson Plan

## Overview
This lesson plan covers ${topic} for ${level} students and is designed to be completed in approximately ${duration}.

## Learning Objectives
By the end of this lesson, students will be able to:
1. Understand the basic concepts of ${topic}
2. Apply ${topic} principles to solve problems
3. Analyze scenarios involving ${topic}

## Materials Needed
- Presentation slides
- Handouts
- Interactive exercises
- Assessment materials

## Lesson Structure

### Introduction (5 minutes)
- Hook: Engaging fact or question about ${topic}
- Overview of learning objectives
- Connection to previous knowledge

### Main Content (${level === "beginner" ? "15" : level === "intermediate" ? "25" : "35"} minutes)
- Explanation of key concepts
- Demonstrations and examples
- Guided practice activities
- Independent practice

### Assessment (5 minutes)
- Quick quiz or check for understanding
- Discussion questions
- Exit ticket

### Conclusion (5 minutes)
- Summary of key points
- Preview of next lesson
- Assignment instructions

## Differentiation Strategies
- For struggling students: Simplified explanations and additional support
- For advanced students: Extended challenges and deeper exploration

## Assessment Criteria
- Participation in discussions
- Completion of practice activities
- Performance on assessment questions
- Application of concepts in assignments`
}

module.exports = router
