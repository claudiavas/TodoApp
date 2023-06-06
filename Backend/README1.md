# API ToDo APP

Este es un ejemplo para empezar a programar la API de la aplicación de tareas (ToDo APP)

## GET /tasks/:id?

### Parameters

Query params
- datemin
- datemax
- search
- status: "COMPLETED", "IN PROGRESS", "PENDING", "POSTPONED", "DELETED"

### Responses

404 
```
{msg: "No se han encontrado tareas"}
```

200 
```
    [
    {
        id: ...,
        task: ...,
        dueDate: ...,
        status: ...,
        createdAt: ...,
        modifiedAt: ...,
        deletedAt: ...,
    }, ...
    ]
```

## POST /tasks/

### Parameters

body:
```
    {
        task: ...,
        dueDate: ...,
    }
```

### Responses

400 
```
{msg: "task exist"}
```

200 
```
    {
        id: ...,
        task: ...,
        dueDate: ...,
        status: ...,
        createdAt: ...,
        modifiedAt: ...,
        deletedAt: ...,
    }
```

## DELETE /tasks/:id

### Responses

404 
```
{msg: "task not exist"}
```

200 
```
{msg: "ok"}
```

## PUT (o PATCH) /tasks/:id

### Parameters

body: 
```
    {
        task: ...,
        dueDate: ...,
        status: ...,
    }
```

### Responses

404 
```
{msg: "task not exist"}
```

200 
```
    {
        id: ...,
        task: ...,
        dueDate: ...,
        status: ...,
        createdAt: ...,
        modifiedAt: ...,
        deletedAt: ...,
    }
```



