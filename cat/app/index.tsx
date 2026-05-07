import { Pressable, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react";

export default function Index() {
  const [task, setTask] = useState<string>("")
  const [storedTasks, setStoredTasks] = useState<string[]>([]);

  useEffect(() => {
    getTask();
  }, [])

  const getTask = async() => {
    const newTask = await AsyncStorage.getItem("tasks");

    if(newTask != null){
      const parsedTasks = JSON.parse(newTask);

      setStoredTasks(parsedTasks)
    }
  }

  const storeTasks = async() => {
    await AsyncStorage.setItem("tasks", JSON.stringify(storedTasks))
  }

  const addTask = () => {

    
    const newTask = [...storedTasks, task];

    setStoredTasks(newTask)
    storeTasks()
    
  }  

  const deleteTask = (id: any) => {
    const newTask = storedTasks.filter((index) => index != id);

    setStoredTasks(newTask);
    console.log(newTask)
  }


  console.log("test")


  return (
    <View className="flex-1 items-center justify-center p-6 gap-6"   >
      <TextInput className="w-full bg-black/5 px-4 py-2 rounded-full text-black" placeholder="enter a new task" onChangeText={(text) => setTask(text)}></TextInput>
      <Pressable className="px-4 py-2 rounded-full bg-black" onPress={addTask}><Text className="text-white">Add Task</Text></Pressable>
      {storedTasks.map((task: string, Index) => (
        <View className="w-full flex flex-row items-center justify-between">
          <Text key={Index}>{task}</Text>
          <Pressable onPress={() => deleteTask(Index)}><Text>Delete</Text></Pressable>
        </View>

      ))}
    </View>
  );
}
