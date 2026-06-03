const fs = require('fs');
const path = require('path');

const walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove unused React import
  content = content.replace(/import React(?:, \{[^}]+\})? from 'react';\n?/g, (match) => {
    if (match.includes('{')) {
      // If it's something like "import React, { useState } from 'react';"
      return match.replace(/React, /, '');
    }
    return '';
  });

  // Convert type imports
  // src/components/steps/Step1_LearnerInfo.tsx: import { AgeGroup, StartupStage } from '../../types';
  content = content.replace(/import {([^}]+)} from '..\/..\/types';/g, "import type { $1 } from '../../types';");
  content = content.replace(/import {([^}]+)} from '\.\.\/types';/g, "import type { $1 } from '../types';");
  content = content.replace(/import {([^}]+)} from '\.\.\/types\/index';/g, "import type { $1 } from '../types/index';");
  
  // src/hooks/useAuth.ts: import { onAuthStateChanged, User } from 'firebase/auth';
  content = content.replace(/import { onAuthStateChanged, User } from 'firebase\/auth';/g, "import { onAuthStateChanged, type User } from 'firebase/auth';");
  
  // src/context/LearnerContext.tsx: import { createContext, useContext, useReducer, ReactNode } from 'react';
  content = content.replace(/import {([^}]+)} from 'react';/g, (match, p1) => {
    if (p1.includes('ReactNode')) {
      return match.replace('ReactNode', 'type ReactNode');
    }
    return match;
  });

  // src/router/ProtectedRoute.tsx: import { ReactNode } from 'react';
  content = content.replace(/import { ReactNode } from 'react';/g, "import type { ReactNode } from 'react';");

  fs.writeFileSync(file, content, 'utf8');
});

// Remove chat.ts which is probably old file
if (fs.existsSync('./src/api/chat.ts')) {
    fs.unlinkSync('./src/api/chat.ts');
}

// Remove Chatbot.tsx which is old file
if (fs.existsSync('./src/components/Chatbot.tsx')) {
    fs.unlinkSync('./src/components/Chatbot.tsx');
}
