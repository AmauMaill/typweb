import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

(global as any).import = {
    meta: {
        env: {
            PROD: false,
            BASE_URL: ''
        },
        glob: jest.fn()
    }
};