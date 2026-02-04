import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { authApi, currencyApi } from '@/lib/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bell, Shield, Eye, EyeOff, Trash2, Loader2, AlertTriangle, Globe, Save, X } from 'lucide-react'
import { SUPPORTED_CURRENCIES, currencySymbol } from '@/lib/currency'


import { SUPPORTED_LANGUAGES } from '@/lib/languages'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

export default function SettingsPage() {
  // Change Password Dialog State
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Password change handler
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both password fields match.',
        variant: 'destructive',
      });
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.setOrChangePassword({ password: newPassword }, token!);
      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully.',
      });
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast({
        title: 'Password Change Failed',
        description: error.message || 'Could not update password.',
        variant: 'destructive',
      });
    } finally {
      setPasswordLoading(false);
    }
  };
  const { user, token, logout, updateProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  // Default settings
  const defaultSettings = {
    emailNotifications: true,
    projectUpdates: true,
    messagingNotifications: true,
    weeklyDigest: false,
    profileVisibility: true,
    showEmail: false,
    twoFactorAuth: false,
  };

  const [settings, setSettings] = useState(defaultSettings)
  const [originalSettings, setOriginalSettings] = useState(defaultSettings)

  // Language separate state for deferral
  const getInitialLanguage = () => {
    if (user?.preferred_language) return user.preferred_language;
    // Fallback to cookie
    const match = document.cookie.match(/(^| )googtrans=([^;]+)/);
    if (match) {
      const parts = match[2].split('/');
      return parts[parts.length - 1] || 'en';
    }
    return 'en';
  };

  const [pendingLanguage, setPendingLanguage] = useState(getInitialLanguage());
  const [originalLanguage, setOriginalLanguage] = useState(getInitialLanguage());

  const [isDirty, setIsDirty] = useState(false);

  // Always fetch latest user profile when settings page is opened
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await authApi.getMe(token);
        if (res.success && res.data?.user) {
          const merged = { ...defaultSettings, ...res.data.user.settings };
          setSettings(merged);
          setOriginalSettings(merged);
          setIsDirty(false);
          if (res.data.user.preferred_language) {
            setPendingLanguage(res.data.user.preferred_language);
            setOriginalLanguage(res.data.user.preferred_language);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Check if dirty
    const settingsChanged = JSON.stringify(newSettings) !== JSON.stringify(originalSettings);
    const langChanged = pendingLanguage !== originalLanguage;
    setIsDirty(settingsChanged || langChanged);
  };

  const handleLanguageChange = (code: string) => {
    setPendingLanguage(code);
    const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    const langChanged = code !== originalLanguage;
    setIsDirty(settingsChanged || langChanged);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings and language preference
      await updateProfile({
        settings,
        preferred_language: pendingLanguage
      });

      // Handle Google Translate cookie
      const targetLang = pendingLanguage === 'en' ? 'en' : pendingLanguage;
      // Always set for apex domain and without domain for compatibility
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=.asteai.com`;
      document.cookie = `googtrans=/en/${targetLang}; path=/;`;

      setOriginalSettings(settings);
      setOriginalLanguage(pendingLanguage);
      setIsDirty(false);
      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully. Reloading...',
      });

      // Reload to apply language change
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save your settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setPendingLanguage(originalLanguage);
    setIsDirty(false);
    toast({
      title: 'Changes Discarded',
      description: 'Your changes have been reverted.',
    });
  };

  // Currency preference - using useQuery to sync with CurrencySelector in navbar
  const { data: currencyData } = useQuery({
    queryKey: ['currency:preferred'],
    queryFn: () => currencyApi.getPreferred(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const preferredCurrency = currencyData?.data?.currency || 'INR';
  const [currencyLoading, setCurrencyLoading] = useState(false)

  const handleCurrencyChange = async (currency: string) => {
    setCurrencyLoading(true)

    // Optimistic update
    const previous = queryClient.getQueryData(['currency:preferred']);
    queryClient.setQueryData(['currency:preferred'], (old: any) => ({
      ...old,
      data: { ...old?.data, currency: currency }
    }));

    try {
      await currencyApi.setPreferred(currency, token!)
      // Invalidate to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['currency:preferred'] })
      await queryClient.invalidateQueries({ queryKey: ['currency:rates'] })

      toast({
        title: 'Currency Updated',
        description: `Your preferred currency has been updated to ${currency}`,
      })
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(['currency:preferred'], previous);

      toast({
        title: 'Save Failed',
        description: 'Failed to update currency preference',
        variant: 'destructive',
      })
    } finally {
      setCurrencyLoading(false)
    }
  }

  const handleDeactivateAccount = async () => {
    setLoading(true)
    try {
      await authApi.deleteAccount(token!, 'deactivate')
      toast({
        title: 'Account Deactivated',
        description: 'Your account has been deactivated. You can reactivate it by logging in again.',
      })
      logout()
      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Deactivation Failed',
        description: error.message || 'Could not deactivate your account.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: 'Confirmation Required',
        description: 'Please type DELETE to confirm account deletion.',
        variant: 'destructive',
      })
      return
    }

    setDeleteLoading(true)
    try {
      await authApi.deleteAccount(token!, 'delete')
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
        variant: 'destructive'
      })
      logout()
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Could not delete your account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
      setConfirmText('')
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">{'Settings'}</h1>
            <p className="text-muted-foreground mt-1">{'Manage your account preferences and privacy settings.'}</p>
          </div>
          {isDirty && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" />
                {'Cancel'}
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {/* Regional Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>{'Regional Settings'}</CardTitle>
              </div>
              <CardDescription>
                {'Customize your language and currency preferences.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{'Language'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Select your preferred language for the interface.'}
                  </p>
                </div>
                <Select
                  value={pendingLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[140px] notranslate">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="notranslate">
                        {lang.native}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-px bg-border/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="currency">{'Currency'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Select your preferred currency for displaying prices.'}
                  </p>
                </div>
                <Select
                  value={preferredCurrency}
                  onValueChange={handleCurrencyChange}
                  disabled={currencyLoading}
                >
                  <SelectTrigger className="w-[140px] notranslate">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((code) => (
                      <SelectItem key={code} value={code} className="notranslate">
                        {currencySymbol(code)} {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>{'Notifications'}</CardTitle>
              </div>
              <CardDescription>
                {'Choose what notifications you want to receive.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">{'Email Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Receive updates about your account via email.'}
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="project-updates">{'Project Updates'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Get notified about project activity and milestones.'}
                  </p>
                </div>
                <Switch
                  id="project-updates"
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => handleSettingChange('projectUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messaging">{'Messaging Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Receive alerts when you get new messages.'}
                  </p>
                </div>
                <Switch
                  id="messaging"
                  checked={settings.messagingNotifications}
                  onCheckedChange={(checked) => handleSettingChange('messagingNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">{'Weekly Digest'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Receive a weekly summary of your activity.'}
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle>{'Privacy'}</CardTitle>
              </div>
              <CardDescription>
                {'Control your profile visibility and data sharing.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility">{'Profile Visibility'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'expert'
                      ? 'Make your profile visible to buyers searching for experts.'
                      : 'Make your profile visible to experts viewing project details.'}
                  </p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={settings.profileVisibility}
                  onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-email">{'Show Email Address'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Allow others to see your email address on your profile.'}
                  </p>
                </div>
                <Switch
                  id="show-email"
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>{'Security'}</CardTitle>
                <Badge variant="outline" className="ml-2 text-xs">{'Coming soon'}</Badge>
              </div>
              <CardDescription>
                {'Protect your account with additional security measures.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">{'Two-Factor Authentication'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Add an extra layer of security to your account. (Coming soon)'}
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={settings.twoFactorAuth}
                  disabled
                />
              </div>

              <div className="pt-4 border-t">
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {'Change Password'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Set a new password for your account. If you signed up with Google, you can add a password here to enable email login.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Current password is optional for Google users, so we skip it for now */}
                    <div className="space-y-3 py-2">
                      {/* <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} autoComplete="current-password" /> */}
                      <div className="space-y-1">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-new-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                            autoComplete="new-password"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleChangePassword} disabled={passwordLoading}>
                        {passwordLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Update Password'}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="ghost" type="button">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {'Set or change your password for email login.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Deactivation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <CardTitle>{'Deactivate Account'}</CardTitle>
              </div>
              <CardDescription>
                {'Temporarily disable your account. You can reactivate it at any time by logging in.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{'Deactivate'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {'Hide your profile and projects. Your data is preserved.'}
                  </p>
                </div>
                <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={loading}>
                      {'Deactivate'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{'Deactivate your account?'}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {'This will hide your profile and projects. Your data will be preserved, and you can reactivate your account anytime by logging in.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{'Cancel'}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeactivateAccount}>{'Deactivate'}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">{'Danger Zone'}</CardTitle>
              </div>
              <CardDescription>
                {'Irreversible and destructive actions.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    {'Delete Account'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      {'Delete Account Permanently?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                      <p dangerouslySetInnerHTML={{ __html: 'This action is <strong>permanent and cannot be undone</strong>. Your account data will be deleted. You can sign up again with the same email, but you will start fresh with a new account.' }} />
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>{'Your profile and public information'}</li>
                        <li>{'All your projects and proposals'}</li>
                        <li>{'All your messages and conversations'}</li>
                        <li>{'Payment history and earnings'}</li>
                        <li>{'All reviews and ratings'}</li>
                      </ul>
                      <div className="pt-4">
                        <Label htmlFor="confirm-delete" className="text-foreground font-medium">
                          {'Type DELETE to confirm:'}
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                          placeholder="Type DELETE"
                          className="mt-2"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText('')}>
                      {'Cancel'}
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAccount();
                      }}
                      disabled={confirmText !== 'DELETE' || deleteLoading}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {'Deleting...'}
                        </>
                      ) : (
                        'Delete My Account'
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {'This action cannot be undone. Please be certain.'}
              </p>
            </CardContent>
          </Card>

          {/* Floating Action Buttons for better visibility on long pages */}
          {isDirty && (
            <div className="fixed bottom-6 right-6 z-50 flex gap-2 animate-in slide-in-from-bottom-4">
              <Card className="flex gap-2 p-2 shadow-xl border-primary/20">
                <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                  {'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {'Save Changes'}
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
