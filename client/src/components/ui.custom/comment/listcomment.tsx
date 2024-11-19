'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/useAuth';
import axiosDefault, { axiosWithAuth } from '@/lib/axios';
import axios from 'axios';
import { Edit, Reply, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserComment {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface Comment {
  _id: number;
  userId?: UserComment;
  content: string;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  _id: string;
  userId?: UserComment;
  content: string;
}
interface ListCommentProps {
  objectId: string;
}
export default function ListComment({ objectId }: ListCommentProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number[]>([]); // Thay đổi từ null thành mảng
  const [replyContent, setReplyContent] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // State to track which comment is being edited
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null); // State to track which reply is being edited
  const [editingContent, setEditingContent] = useState(''); // State to hold the content for editing

  const [userId, setUserId] = useState<string>('');

  const fetchingUser = async () => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    try {
      const res = await axiosWithAuth(token).get(`/auth/user`);
      console.log(res.data);
      if (res.status === 200) setUserId(res.data._id);
      // console.log('Location update successful:', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching comment: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const fetchingComment = async () => {
    try {
      const res = await axiosDefault.get(`/comment/${objectId}`);
      console.log(res.data);
      if (res.status === 200) setComments(res.data);
      // console.log('Location update successful:', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching comment: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    if (!newComment.trim()) return null;
    const data = {
      objectId,
      content: newComment,
    };
    try {
      const res = await axiosWithAuth(token).post(`/comment`, data);
      console.log(res.data);
      if (res.status === 200) {
        setNewComment('');
        await fetchingComment();
      }
      // console.log('Location update successful:', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error comment: ', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    if (!replyContent.trim()) return null;
    const data = {
      // objectId,
      content: replyContent,
    };
    try {
      const res = await axiosWithAuth(token).post(
        `/comment/reply/${commentId}`,
        data,
      );
      console.log(res.data);
      if (res.status === 200) {
        setReplyContent('');
        await fetchingComment();
        setReplyingTo(replyingTo.filter((id) => id !== commentId));
      }
      // console.log('Location update successful:', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error repply comment: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  // Function to handle editing a comment
  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  // Function to handle editing a reply
  const handleEditReply = (
    commentId: number,
    replyId: string,
    content: string,
  ) => {
    console.log(commentId);
    setEditingReplyId(replyId);
    setEditingContent(content);
  };

  // Function to submit edited comment
  const handleEditCommentSubmit = async (
    e: React.FormEvent,
    commentId: number,
  ) => {
    e.preventDefault();
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    if (!editingContent.trim()) return null;
    const data = {
      content: editingContent,
    };
    try {
      const res = await axiosWithAuth(token).put(`/comment/${commentId}`, data);
      console.log(res.data);
      if (res.status === 200) {
        setEditingCommentId(null);
        setEditingContent('');
        await fetchingComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error editing comment: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  // Function to submit edited reply
  const handleEditReplySubmit = async (
    e: React.FormEvent,
    commentId: number,
    replyId: string,
  ) => {
    e.preventDefault();
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    if (!editingContent.trim()) return null;
    const data = {
      content: editingContent,
      replyId,
    };
    try {
      const res = await axiosWithAuth(token).put(
        `/comment/reply/${commentId}`,
        data,
      );
      console.log(res.data);
      if (res.status === 200) {
        setEditingReplyId(null);
        setEditingContent('');
        await fetchingComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error editing reply: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    try {
      const res = await axiosWithAuth(token).delete(`/comment/${commentId}`);
      console.log(res.data);
      if (res.status === 200) {
        await fetchingComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error deleting comment: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleDeleteReply = async (commentId: number, replyId: string) => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    try {
      const res = await axiosWithAuth(token).delete(
        `/comment/reply/${commentId}/${replyId}`,
      );
      console.log(res.data);
      if (res.status === 200) {
        await fetchingComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error deleting reply: ',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    fetchingComment();
  }, [objectId]);

  useEffect(() => {
    if (user && user.accessToken) {
      fetchingUser();
    }
  }, [user]);
  // console.log(user);
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Comments</h2>
      {user && user.accessToken && (
        <div>
          {/* Main comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-4 min-h-[100px]"
            />
            <Button type="submit" size="lg">
              Post Comment
            </Button>
          </form>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-8">
        {comments.map((comment: Comment) => (
          <div key={comment._id} className=" p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={comment.userId?.image} />
                <AvatarFallback>
                  {comment.userId?.username as string}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {comment.userId?.username}
                </h3>
                {editingCommentId === comment._id ? (
                  <form
                    onSubmit={(e) => handleEditCommentSubmit(e, comment._id)}
                    className="mt-2"
                  >
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      placeholder="Edit your comment..."
                      className="mb-4 min-h-[80px]"
                    />
                    <Button type="submit">Save</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent('');
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                )}
              </div>
            </div>
            {user && user.accessToken && (
              <div>
                {/* Reply button */}
                {!replyingTo.includes(comment._id) && (
                  <div className="flex flex-row space-x-2">
                    <button
                      onClick={() => {
                        setReplyingTo([...replyingTo, comment._id]);
                        console.log(comment._id);
                      }} // Thêm comment.id vào mảng
                      className="-mt-0.5"
                    >
                      <Reply className="mr-2 h-4 w-4" />
                    </button>
                    {comment.userId?._id === userId && (
                      <div>
                        <button
                          // variant="outline"
                          // onClick={() => handleEditComment(comment._id)} // Function to handle editing
                          className="mt-2"
                          onClick={() =>
                            handleEditComment(comment._id, comment.content)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                        </button>
                        <button
                          // variant="outline"
                          // onClick={() => handleDeleteComment(comment._id)} // Function to handle deletion
                          className="mt-2"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reply form */}
                {replyingTo.includes(comment._id) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReplySubmit(comment._id);
                    }}
                    className="mt-6"
                  >
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="mb-4 min-h-[80px]"
                    />
                    <Button type="submit">Post Reply</Button>
                    {/* Close button to hide the reply form */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(
                          replyingTo.filter((id) => id !== comment._id),
                        );
                        setReplyContent(''); // Clear the reply content
                      }}
                      className="ml-2"
                    >
                      Close
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="mt-6 pl-8 border-l-2 border-gray-200">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={reply.userId?.image} />

                        <AvatarFallback>
                          {reply.userId?.username}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                          {reply.userId?.username}
                        </h4>
                        {editingReplyId === reply._id ? (
                          <form
                            onSubmit={(e) =>
                              handleEditReplySubmit(e, comment._id, reply._id)
                            }
                            className="mt-2"
                          >
                            <Textarea
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              placeholder="Edit your reply..."
                              className="mb-4 min-h-[80px]"
                            />
                            <Button type="submit">Save</Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingReplyId(null);
                                setEditingContent('');
                              }}
                              className="ml-2"
                            >
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <p className="mt-1 text-gray-600">{reply.content}</p>
                        )}
                      </div>
                    </div>

                    {reply.userId?._id === userId && (
                      <div className="flex flex-row space-x-2">
                        <button
                          // variant="outline"
                          // onClick={() => handleEditComment(comment._id)} // Function to handle editing
                          className="mt-2"
                          onClick={() =>
                            handleEditReply(
                              comment._id,
                              reply._id,
                              reply.content,
                            )
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                        </button>
                        <button
                          // variant="outline"
                          // onClick={() => handleDeleteComment(comment._id)} // Function to handle deletion
                          className="mt-2"
                          onClick={() =>
                            handleDeleteReply(comment._id, reply._id)
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
