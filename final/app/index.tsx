import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Index() {
  const [task, setTask] = useState<string>("");
  const [storedTasks, setStoredTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks !== null) {
        setStoredTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log("Error loading tasks", error);
    }
  };

  const saveToStorage = async (tasks: Task[]) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  };

 
  const addTask = () => {
    if (!task.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      completed: false,
    };
    const updatedTasks = [...storedTasks, newTask];
    setStoredTasks(updatedTasks);
    saveToStorage(updatedTasks);
    setTask(""); 
  };


  const toggleTask = (id: string) => {
    const updatedTasks = storedTasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setStoredTasks(updatedTasks);
    saveToStorage(updatedTasks);
  };

  
  const deleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const filteredTasks = storedTasks.filter((item) => item.id !== id);
          setStoredTasks(filteredTasks);
          saveToStorage(filteredTasks);
        },
      },
    ]);
  };


  const completeAllTasks = () => {
    const updated = storedTasks.map(t => ({ ...t, completed: true }));
    setStoredTasks(updated);
    saveToStorage(updated);
  };

  const deleteCompleted = () => {
    const filtered = storedTasks.filter(t => !t.completed);
    setStoredTasks(filtered);
    saveToStorage(filtered);
  };


  const completedCount = storedTasks.filter(t => t.completed).length;
  const pendingCount = storedTasks.length - completedCount;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">

      { }
      <Stack.Screen options={{ headerShown: false }} />
      { }
      <View className="mb-6 mt-4">
        <Text className="text-3xl font-bold text-gray-800">My Tasks</Text>
        <View className="flex-row mt-2">
          <View className="bg-blue-500 px-3 py-1 rounded-full mr-2">
            <Text className="text-white text-xs">Pending: {pendingCount}</Text>
          </View>
          <View className="bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs">Done: {completedCount}</Text>
          </View>
        </View>
      </View>

      { }
      <View className="flex-row mb-6">
        <TextInput
          className="flex-1 bg-white p-4 rounded-xl shadow-sm mr-2"
          placeholder="What needs to be done?"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity 
          onPress={addTask}
          className="bg-blue-600 p-4 rounded-xl justify-center"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/*listt */}
      <FlatList
        data={storedTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <Text className="text-gray-400">No tasks yet. Add one above!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm">
            <TouchableOpacity 
              className="flex-1 flex-row items-center" 
              onPress={() => toggleTask(item.id)}
            >
              <Ionicons 
                name={item.completed ? "checkbox" : "square-outline"} 
                size={24} 
                color={item.completed ? "#10b981" : "#9ca3af"} 
              />
              <Text className={`ml-3 text-lg ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {item.title}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      { }
      {storedTasks.length > 0 && (
        <View className="flex-row justify-between mt-4 border-t border-gray-200 pt-4">
          <TouchableOpacity onPress={completeAllTasks}>
            <Text className="text-blue-500 font-semibold">Mark all done</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteCompleted}>
            <Text className="text-red-500 font-semibold">Clear completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}