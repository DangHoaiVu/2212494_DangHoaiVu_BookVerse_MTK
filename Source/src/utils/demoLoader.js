/**
 * Demo Data Loader
 * Loads sample data for demonstration
 */
export class DemoLoader {
    static loadSampleData() {
        return [
            {
                id: 1,
                title: "JavaScript: The Good Parts",
                author: "Douglas Crockford",
                category: "Programming",
                description: "A comprehensive guide to JavaScript programming",
                cover: "https://images-na.ssl-images-amazon.com/images/I/81kqrwS1nNL.jpg"
            },
            {
                id: 2,
                title: "Clean Code",
                author: "Robert C. Martin",
                category: "Programming",
                description: "A Handbook of Agile Software Craftsmanship",
                cover: "https://images-na.ssl-images-amazon.com/images/I/515iEcDr1GL.jpg"
            },
            {
                id: 3,
                title: "Design Patterns",
                author: "Gang of Four",
                category: "Programming",
                description: "Elements of Reusable Object-Oriented Software",
                cover: "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL.jpg"
            }
        ];
    }

    static async loadFromAPI() {
        try {
            const response = await fetch('/api/books');
            return await response.json();
        } catch (error) {
            console.error('Failed to load data from API:', error);
            return this.loadSampleData();
        }
    }
}

export function initializeDemoData() {
    return DemoLoader.loadSampleData();
}
