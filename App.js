import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState('feed'); // 'feed', 'detail', 'favorites', 'myFood', 'addEdit'
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories (At least 10 horizontal categories + "My Food")
  const categories = [
    'All',
    'My Food',
    'Italian',
    'Mexican',
    'Asian',
    'American',
    'Desserts',
    'Healthy',
    'Breakfast',
    'Seafood',
    'Vegetarian',
  ];

  // Initial Recipes Database
  const [recipes, setRecipes] = useState([
    {
      id: '1',
      name: 'Classic Margherita Pizza',
      category: 'Italian',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500',
      prepTime: '30 mins',
      servings: '4 servings',
      calories: '650 kcal',
      difficulty: 'Medium',
      ingredients: ['Pizza dough', 'San Marzano tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Olive oil'],
      instructions: '1. Preheat oven to 450°F.\n2. Roll out dough on a floured surface.\n3. Spread crushed tomatoes evenly.\n4. Add sliced mozzarella and fresh basil leaves.\n5. Drizzle with olive oil and bake for 12-15 minutes until crust is golden.',
      isFavorite: false,
      isUserCreated: false,
    },
    {
      id: '2',
      name: 'Creamy Garlic Butter Pasta',
      category: 'Italian',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288546?w=500',
      prepTime: '20 mins',
      servings: '2 servings',
      calories: '520 kcal',
      difficulty: 'Easy',
      ingredients: ['Fettuccine pasta', 'Heavy cream', 'Butter', 'Garlic minced', 'Parmesan cheese'],
      instructions: '1. Boil pasta in salted water until al dente.\n2. Melt butter in a skillet and sauté minced garlic.\n3. Pour in heavy cream and simmer for 5 minutes.\n4. Stir in grated Parmesan cheese until smooth.\n5. Toss pasta in the sauce and serve hot.',
      isFavorite: true,
      isUserCreated: false,
    },
    {
      id: '3',
      name: 'Avocado & Egg Toast',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500',
      prepTime: '10 mins',
      servings: '1 serving',
      calories: '310 kcal',
      difficulty: 'Easy',
      ingredients: ['Sourdough bread', 'Ripe avocado', 'Eggs', 'Lemon juice', 'Chili flakes', 'Salt & pepper'],
      instructions: '1. Toast a slice of sourdough bread.\n2. Mash avocado in a bowl with lemon juice, salt, and pepper.\n3. Fry or poach an egg to your liking.\n4. Spread mashed avocado on toast and top with the egg.\n5. Sprinkle with chili flakes.',
      isFavorite: false,
      isUserCreated: false,
    },
  ]);

  // Form State for Add / Edit Recipe
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('Italian');
  const [recipeImage, setRecipeImage] = useState('');
  const [recipePrepTime, setRecipePrepTime] = useState('');
  const [recipeServings, setRecipeServings] = useState('');
  const [recipeCalories, setRecipeCalories] = useState('');
  const [recipeDifficulty, setRecipeDifficulty] = useState('Easy');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');

  // Toggle Favorite
  const toggleFavorite = (id) => {
    setRecipes(
      recipes.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Save or Update Recipe
  const handleSaveRecipe = () => {
    if (!recipeName || !recipeIngredients || !recipeInstructions) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Ingredients, Instructions).');
      return;
    }

    const ingredientsArray = recipeIngredients.split('\n').filter((item) => item.trim() !== '');

    if (isEditing) {
      setRecipes(
        recipes.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: recipeName,
                category: recipeCategory,
                image: recipeImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500',
                prepTime: recipePrepTime || '15 mins',
                servings: recipeServings || '2 servings',
                calories: recipeCalories || '400 kcal',
                difficulty: recipeDifficulty,
                ingredients: ingredientsArray,
                instructions: recipeInstructions,
              }
            : item
        )
      );
      Alert.alert('Success', 'Recipe updated successfully!');
    } else {
      const newRecipe = {
        id: Date.now().toString(),
        name: recipeName,
        category: recipeCategory,
        image: recipeImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500',
        prepTime: recipePrepTime || '15 mins',
        servings: recipeServings || '2 servings',
        calories: recipeCalories || '400 kcal',
        difficulty: recipeDifficulty,
        ingredients: ingredientsArray,
        instructions: recipeInstructions,
        isFavorite: false,
        isUserCreated: true,
      };
      setRecipes([newRecipe, ...recipes]);
      Alert.alert('Success', 'New recipe added successfully!');
    }

    clearForm();
    setCurrentScreen('myFood');
  };

  // Delete Recipe
  const handleDeleteRecipe = (id) => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setRecipes(recipes.filter((item) => item.id !== id));
          setCurrentScreen('myFood');
        },
      },
    ]);
  };

  // Open Edit Form
  const handleOpenEdit = (recipe) => {
    setIsEditing(true);
    setEditId(recipe.id);
    setRecipeName(recipe.name);
    setRecipeCategory(recipe.category);
    setRecipeImage(recipe.image);
    setRecipePrepTime(recipe.prepTime);
    setRecipeServings(recipe.servings);
    setRecipeCalories(recipe.calories);
    setRecipeDifficulty(recipe.difficulty);
    setRecipeIngredients(recipe.ingredients.join('\n'));
    setRecipeInstructions(recipe.instructions);
    setCurrentScreen('addEdit');
  };

  const clearForm = () => {
    setIsEditing(false);
    setEditId(null);
    setRecipeName('');
    setRecipeCategory('Italian');
    setRecipeImage('');
    setRecipePrepTime('');
    setRecipeServings('');
    setRecipeCalories('');
    setRecipeDifficulty('Easy');
    setRecipeIngredients('');
    setRecipeInstructions('');
  };

  // Filtered Recipes for Feed
  const filteredRecipes =
    selectedCategory === 'All'
      ? recipes
      : recipes.filter((item) => item.category === selectedCategory);

  // User-created recipes ("My Recipes" section)
  const userRecipes = recipes.filter((item) => item.isUserCreated);
  const favoriteRecipes = recipes.filter((item) => item.isFavorite);

  // ==================== SCREENS ====================

  // 1. MAIN FEED SCREEN
  const renderFeedScreen = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍳 Foodie App</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setCurrentScreen('favorites')} style={styles.iconButton}>
            <Ionicons name="heart" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Categories (At least 10 + My Food) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.activeCategoryChip,
                cat === 'My Food' && styles.myFoodChip,
              ]}
              onPress={() => {
                if (cat === 'My Food') {
                  setCurrentScreen('myFood');
                } else {
                  setSelectedCategory(cat);
                  setCurrentScreen('feed');
                }
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                  cat === 'My Food' && styles.myFoodText,
                ]}
              >
                {cat === 'My Food' ? '📁 My Food' : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recipe Feed List */}
      <ScrollView contentContainerStyle={styles.recipeList}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Discover Recipes' : `${selectedCategory} Recipes`}
        </Text>
        {filteredRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No recipes found in this category.</Text>
        ) : (
          filteredRecipes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recipeCard}
              onPress={() => {
                setSelectedRecipe(item);
                setCurrentScreen('detail');
              }}
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeCardInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Ionicons
                      name={item.isFavorite ? 'heart' : 'heart-outline'}
                      size={22}
                      color="#e74c3c"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeCategoryTag}>{item.category}</Text>
                <View style={styles.recipeMetaRow}>
                  <Text style={styles.metaText}>⏱ {item.prepTime}</Text>
                  <Text style={styles.metaText}>🔥 {item.calories}</Text>
                  <Text style={styles.metaText}>📊 {item.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  // 2. RECIPE DETAIL SCREEN
  const renderDetailScreen = () => {
    if (!selectedRecipe) return null;
    return (
      <View style={styles.container}>
        {/* Back Button Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen(selectedRecipe.isUserCreated ? 'myFood' : 'feed')}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(selectedRecipe.id)}>
            <Ionicons
              name={selectedRecipe.isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color="#e74c3c"
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.detailScroll}>
          <Image source={{ uri: selectedRecipe.image }} style={styles.detailImage} />
          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedRecipe.name}</Text>
            <Text style={styles.detailCategoryBadge}>{selectedRecipe.category}</Text>

            {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Prep Time</Text>
                <Text style={styles.statValue}>{selectedRecipe.prepTime}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Servings</Text>
                <Text style={styles.statValue}>{selectedRecipe.servings}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Calories</Text>
                <Text style={styles.statValue}>{selectedRecipe.calories}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Difficulty</Text>
                <Text style={styles.statValue}>{selectedRecipe.difficulty}</Text>
              </View>
            </View>

            {/* Ingredients */}
            <Text style={styles.subHeading}>Ingredients</Text>
            {selectedRecipe.ingredients.map((ing, idx) => (
              <Text key={idx} style={styles.bulletItem}>• {ing}</Text>
            ))}

            {/* Instructions */}
            <Text style={styles.subHeading}>Instructions</Text>
            <Text style={styles.instructionText}>{selectedRecipe.instructions}</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  // 3. FAVORITES SCREEN
  const renderFavoritesScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('feed')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back to Feed</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>❤️ Favorite Recipes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.recipeList}>
        {favoriteRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No favorite recipes added yet. Tap the heart icon on any recipe!</Text>
        ) : (
          favoriteRecipes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recipeCard}
              onPress={() => {
                setSelectedRecipe(item);
                setCurrentScreen('detail');
              }}
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeCardInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Ionicons name="heart" size={22} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeCategoryTag}>{item.category}</Text>
                <View style={styles.recipeMetaRow}>
                  <Text style={styles.metaText}>⏱ {item.prepTime}</Text>
                  <Text style={styles.metaText}>🔥 {item.calories}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  // 4. MY FOOD / MY RECIPES SCREEN
  const renderMyFoodScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('feed')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📁 My Food & Recipes</Text>
        <TouchableOpacity
          style={styles.addButtonHeader}
          onPress={() => {
            clearForm();
            setCurrentScreen('addEdit');
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.recipeList}>
        <TouchableOpacity
          style={styles.addNewButtonBanner}
          onPress={() => {
            clearForm();
            setCurrentScreen('addEdit');
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#27ae60" />
          <Text style={styles.addNewBannerText}>+ Add New Recipe</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Recipes ({userRecipes.length})</Text>
        {userRecipes.length === 0 ? (
          <Text style={styles.emptyText}>You haven't created any recipes yet. Tap above to add your first recipe!</Text>
        ) : (
          userRecipes.map((item) => (
            <View key={item.id} style={styles.myRecipeCard}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row' }}
                onPress={() => {
                  setSelectedRecipe(item);
                  setCurrentScreen('detail');
                }}
              >
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
                <View style={styles.recipeCardInfo}>
                  <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.recipeCategoryTag}>{item.category}</Text>
                  <Text style={styles.metaText}>⏱ {item.prepTime} | 🍽 {item.servings}</Text>
                </View>
              </TouchableOpacity>

              {/* Edit & Delete Buttons */}
              <View style={styles.crudButtonsCol}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleOpenEdit(item)}>
                  <Ionicons name="create-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteRecipe(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  // 5. ADD / EDIT RECIPE FORM SCREEN
  const renderAddEditScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('myFood')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formScroll}>
        <Text style={styles.label}>Recipe Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Homemade Tacos"
          value={recipeName}
          onChangeText={setRecipeName}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mexican, Italian, Desserts"
          value={recipeCategory}
          onChangeText={setRecipeCategory}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://images.unsplash.com/..."
          value={recipeImage}
          onChangeText={setRecipeImage}
        />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Prep Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25 mins"
              value={recipePrepTime}
              onChangeText={setRecipePrepTime}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Servings</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4 servings"
              value={recipeServings}
              onChangeText={setRecipeServings}
            />
          </View>
        </View>

        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 450 kcal"
              value={recipeCalories}
              onChangeText={setRecipeCalories}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Difficulty</Text>
            <TextInput
              style={styles.input}
              placeholder="Easy / Medium / Hard"
              value={recipeDifficulty}
              onChangeText={setRecipeDifficulty}
            />
          </View>
        </View>

        <Text style={styles.label}>Ingredients (one per line) *</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder={'Ingredient 1\nIngredient 2\nIngredient 3'}
          multiline
          value={recipeIngredients}
          onChangeText={setRecipeIngredients}
        />

        <Text style={styles.label}>Step-by-Step Instructions *</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          placeholder="1. Step one...\n2. Step two..."
          multiline
          value={recipeInstructions}
          onChangeText={setRecipeInstructions}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Update Recipe' : 'Save Recipe'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 'feed' && renderFeedScreen()}
      {currentScreen === 'detail' && renderDetailScreen()}
      {currentScreen === 'favorites' && renderFavoritesScreen()}
      {currentScreen === 'myFood' && renderMyFoodScreen()}
      {currentScreen === 'addEdit' && renderAddEditScreen()}
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
  },
  addButtonHeader: {
    backgroundColor: '#27ae60',
    padding: 6,
    borderRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 6,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryScroll: {
    paddingHorizontal: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
  },
  activeCategoryChip: {
    backgroundColor: '#27ae60',
  },
  myFoodChip: {
    backgroundColor: '#e67e22',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#fff',
  },
  myFoodText: {
    color: '#fff',
  },
  recipeList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 14,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myRecipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeCardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 6,
  },
  recipeCategoryTag: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
    marginVertical: 2,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  detailScroll: {
    paddingBottom: 40,
  },
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailCategoryBadge: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginVertical: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 2,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  addNewButtonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f8f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a3e4d7',
  },
  addNewBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 8,
  },
  crudButtonsCol: {
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#2980b9',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  deleteBtn: {
    backgroundColor: '#c0392b',
    padding: 8,
    borderRadius: 6,
  },
  formScroll: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
