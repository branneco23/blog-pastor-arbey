// Ejemplo de tabla de usuarios para el Admin
export default function UserManagement({ users }) {
  const handleSuspend = async (id) => {
    await fetch(`/api/users/${id}/suspend`, { method: 'PATCH' });
  };

  return (
    <table className="w-full">
      <thead>{/* ... */}</thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>
              <button onClick={() => handleSuspend(user._id)} className="text-orange-500">
                Suspender
              </button>
              <button className="text-red-600">Eliminar Comentarios</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}